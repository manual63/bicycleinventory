import { Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Stack } from "@mui/material";

export const BikeCardSkeleton = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={<Skeleton variant="text" width="60%" />}
        subheader={<Skeleton variant="text" width="40%" />}
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1} useFlexGap>
            <Skeleton variant="rounded" width="15%" height={24} sx={{ borderRadius: 4 }} />
            <Skeleton variant="rounded" width="20%" height={24} sx={{ borderRadius: 4 }} />
          </Stack>
          <Divider />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          <Skeleton variant="rounded" width={64} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
          <Skeleton variant="text" width={70} height={36} />
        </Stack>
      </CardActions>
    </Card>
  );
};
