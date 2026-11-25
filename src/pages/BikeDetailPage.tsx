import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Box, Button, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from 'react';
import { LogRideDialog } from '../components/maintenance/LogRideDialog';
import { Link, useParams, useSearchParams } from "react-router";
import { ComponentsTab } from '../components/bikeDetail/ComponentsTab';
import { MaintenanceTab } from '../components/bikeDetail/MaintenanceTab';
import { OverviewTab } from '../components/bikeDetail/OverviewTab';
import { BikeDetailSkeleton } from '../components/bikes/BikeDetailSkeleton';
import ErrorState from '../components/bikes/ErrorState';
import { useLoadBikes } from '../hooks/useLoadBikes';
import { todayIso } from '../libs/dates';
import { getPartEntries, needsAttention } from '../libs/maintenance';
import { useBikeStore } from "../store/bikeStore";
import { bikeTypeLabels } from "../types/bike";
import { PageNotFound } from './PageNotFound';

const tabs = ["overview", "components", "maintenance"] as const;
type DetailTab = typeof tabs[number];

const isDetailTab = (value: string | null): value is DetailTab => tabs.includes(value as DetailTab);

const TabLabel = ({ text, count, color }: { text: string; count?: number; color?: "default" | "warning" }) => (
  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
    <span>{text}</span>
    {count !== undefined && count > 0 && <Chip size="small" label={count} color={color} sx={{ height: 20 }} />}
  </Stack>
);

export const BikeDetailPage = () => {
  const { bikeId } = useParams();
  const { status, retry } = useLoadBikes();
  const bike = useBikeStore((s) => s.bikes.find((bike) => bike.id === bikeId));

  // The tab and highlighted part live in the URL, so refresh/back/links all work.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: DetailTab = isDetailTab(tabParam) ? tabParam : "overview";
  const highlightPartId = searchParams.get("part");
  const [rideOpen, setRideOpen] = useState(false);

  if (status === "loading") return <BikeDetailSkeleton />;
  if (status === "error") return <ErrorState onRetry={retry} />;
  if (!bike) return <PageNotFound />;

  const today = todayIso();
  const entries = getPartEntries(bike.parts, bike.rides, today);
  const attentionCount = entries.filter((entry) => needsAttention(entry.health.status)).length;
  const defaultInstallDate = bike.acquiredDate ?? today;

  const selectTab = (next: DetailTab) => setSearchParams({ tab: next }, { replace: true });

  // Pushes a history entry so Back returns to the calendar.
  const openPart = (partId: string) => setSearchParams({ tab: "components", part: partId });

  return (
    <Stack spacing={3} sx={{ my: 2 }}>
      <Box>
        <Button component={Link} to="/bikes" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 1 }}>
          My Bikes
        </Button>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "flex-end" } }}>
          <Box>
            <Typography variant="h3" component="h1">
              {bike.brand} {bike.model}{" "}
              {bike.isElectric && <ElectricBoltIcon titleAccess="Electric" />}
            </Typography>
            <Typography color="text.secondary">
              {bike.year} {"·"} {bikeTypeLabels[bike.type]}
            </Typography>
          </Box>
          <Button variant="contained" size="large" startIcon={<DirectionsBikeIcon />} onClick={() => setRideOpen(true)}>
            Log miles
          </Button>
        </Stack>
      </Box>
      <LogRideDialog bike={bike} open={rideOpen} onClose={() => setRideOpen(false)} />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_event, next: DetailTab) => selectTab(next)} variant="scrollable" allowScrollButtonsMobile>
          <Tab value="overview" label="Overview" />
          <Tab value="components" label={<TabLabel text="Components" count={bike.parts.length} />} />
          <Tab value="maintenance" label={<TabLabel text="Maintenance" count={attentionCount} color="warning" />} />
        </Tabs>
      </Box>

      {tab === "overview" && (
        <OverviewTab bike={bike} entries={entries} onManageComponents={() => selectTab("components")} />
      )}
      {tab === "components" && (
        <ComponentsTab
          bike={bike}
          entries={entries}
          defaultInstallDate={defaultInstallDate}
          highlightPartId={highlightPartId}
        />
      )}
      {tab === "maintenance" && (
        <MaintenanceTab bike={bike} entries={entries} today={today} onSelectPart={openPart} />
      )}
    </Stack>
  );
};
