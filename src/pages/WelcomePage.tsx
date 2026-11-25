import { type SvgIconComponent } from '@mui/icons-material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BuildIcon from '@mui/icons-material/Build';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

type Feature = {
  title: string;
  description: string;
  icon: SvgIconComponent;
} & (
    | { status: "available"; to: string }
    | { status: "comingSoon" }
  );

const features: Feature[] = [
  {
    title: "My Bikes",
    description: "Track every bike and part you own.",
    icon: PedalBikeIcon,
    status: "available",
    to: "/bikes",
  },
  {
    title: "Maintenance and Log Miles",
    description: "Log service and part swaps.",
    icon: BuildIcon,
    status: "available",
    to: "/bikes",
  },
  {
    title: "Tire Pressure",
    description: "Find the right PSI for your ride.",
    icon: TireRepairIcon,
    status: "available",
    to: "/tire-pressure",
  }
]

export const WelcomePage = () => {
  return (
    <>
      <Box
        sx={{
          mt: 4,
          borderRadius: 4,
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 10 },
          bgcolor: (theme) => theme.alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <Stack spacing={3}>
          <PedalBikeIcon sx={{ fontSize: 56, color: "primary.main" }} />
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: "700", fontSize: { xs: "2.5rem", md: "3.75rem" } }}>
            Shad's Cycleworks
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400, maxWidth: 520 }}>
            Your bikes, parts, and maintenance — all in one garage.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button component={Link} to="/bikes" variant="contained" size="large">View My Bikes</Button>
            <Button component={Link} to="/bikes?add=true" variant="outlined" size="large" startIcon={<AddOutlinedIcon />}>
              Add a Bike
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
        What's in the garage?
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <Card
                variant="outlined"
                sx={{ height: "100%", display: "flex", flexDirection: "column", opacity: feature.status === "comingSoon" ? 0.7 : 1 }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      bgcolor: (theme) => theme.alpha(theme.palette.primary.main, 0.12)
                    }}
                  >
                    <Icon sx={{ color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                </CardContent>
                <CardActions>
                  {feature.status === "available" && <Button component={Link} to={feature.to} endIcon={<ArrowForwardIcon />}>Open</Button>}
                  {feature.status === "comingSoon" && <Chip label="Coming soon" size="small" />}
                </CardActions>
              </Card>
            </Grid>
          )
        }
        )}
      </Grid>
    </>
  )
};
