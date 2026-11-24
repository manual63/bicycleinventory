import type { SvgIconComponent } from "@mui/icons-material";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

type StatCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: SvgIconComponent;
  color?: "primary" | "warning" | "error" | "success";
};

export const StatCard = ({ label, value, caption, icon: Icon, color = "primary" }: StatCardProps) => (
  <Card variant="outlined" sx={{ height: "100%", borderRadius: 4 }}>
    <CardContent>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Avatar sx={{ width: 36, height: 36, bgcolor: (theme) => theme.alpha(theme.palette[color].main, 0.12), color: `${color}.main` }}>
          <Icon fontSize="small" />
        </Avatar>
      </Stack>
      <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{caption}</Typography>
    </CardContent>
  </Card>
);
