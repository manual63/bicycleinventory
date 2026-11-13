import { Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Stack } from "@mui/material";

const BikeCardSkeleton = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={<Skeleton variant="text" width="60%" />}
        subheader={<Skeleton variant="text" width="40%" />}
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={1}>
          <Skeleton variant="rounded" width="100%" height={24} sx={{ borderRadius: 4 }} />
          <Divider />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          <Skeleton variant="rounded" width={64} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Stack>
      </CardActions>
    </Card>
  );
};

export default BikeCardSkeleton;
