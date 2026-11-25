import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, IconButton,
  LinearProgress, Menu, MenuItem, Stack, Typography,
} from "@mui/material";
import { useState } from "react";
import { formatDate } from "../../libs/dates";
import type { PartHealth } from "../../libs/maintenance";
import { formatInterval, getPartTypeInfo, partCategoryLabels, partDisplayName, type BikePart } from "../../types/part";
import { statusMeta } from "../maintenance/statusMeta";

type PartCardProps = {
  part: BikePart;
  health: PartHealth;
  highlighted?: boolean;
  onEdit: (part: BikePart) => void;
  onDelete: (part: BikePart) => void;
  onLogService: (part: BikePart) => void | Promise<void>;
};

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.5 }}>{label}</Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

export const PartCard = ({ part, health, highlighted = false, onEdit, onDelete, onLogService }: PartCardProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const info = getPartTypeInfo(part.type);
  const { color, label } = statusMeta[health.status];

  const handleLogService = async () => {
    setIsLogging(true);
    try {
      await onLogService(part);
    } catch {
      // reported by the action
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Card
      id={`part-${part.id}`}
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 4,
        borderWidth: highlighted ? 2 : 1,
        borderColor: highlighted ? "primary.main" : health.status === "overdue" ? "error.light" : "divider",
        scrollMarginTop: 96,
        transition: "border-color 0.3s",
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
          <Avatar sx={{ bgcolor: (theme) => theme.alpha(theme.palette[color].main, 0.12), color: `${color}.main` }}>
            <TuneIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
                {partDisplayName(part)}
              </Typography>
              {health.status !== "untracked" && (
                <Chip size="small" label={label} color={color} variant="outlined" />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {info.label} · {partCategoryLabels[info.category]}
            </Typography>
          </Box>
          <IconButton aria-label="Component actions" size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={menuAnchor !== null} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => { setMenuAnchor(null); onEdit(part); }}>Edit</MenuItem>
            <MenuItem onClick={() => { setMenuAnchor(null); onDelete(part); }} sx={{ color: "error.main" }}>Delete</MenuItem>
          </Menu>
        </Stack>

        {part.interval && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", mb: 0.75 }}>
              <Typography variant="body2" color={`${color}.main`} sx={{ fontWeight: 500 }}>
                {health.summary}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {health.dueDate
                  ? `${health.estimated ? "≈ " : ""}${formatDate(health.dueDate)}`
                  : "Log miles to estimate"}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={health.progress * 100}
              color={color}
              aria-label={`${Math.round(health.progress * 100)}% of service interval used`}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid size={6}><InfoBlock label="Installed" value={formatDate(part.installDate)} /></Grid>
          <Grid size={6}>
            <InfoBlock label="Last maintained" value={part.lastServiced ? formatDate(part.lastServiced) : "Never"} />
          </Grid>
        </Grid>

        {part.details && (
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {part.details}
          </Typography>
        )}

        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ mb: 1.5 }} />
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary" }}>
              <EventIcon fontSize="small" />
              <Typography variant="body2">
                {part.interval ? `${formatInterval(part.interval)}${info.task ? ` · ${info.task}` : ""}` : "No schedule"}
              </Typography>
            </Stack>
            {part.interval && (
              <Button size="small" endIcon={<CheckCircleIcon />} onClick={handleLogService} loading={isLogging}>
                Log service
              </Button>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
