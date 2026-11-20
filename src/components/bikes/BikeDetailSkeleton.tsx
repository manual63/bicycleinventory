import { Card, CardContent, CardHeader, Divider, Skeleton, Stack } from "@mui/material"

export const BikeDetailSkeleton = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", my: 2 }}>
      <CardHeader
        title={<Skeleton variant="text" width="60%" />}
        subheader={<Skeleton variant="text" width="40%" />}
        slotProps={{
          title: { variant: "h3", component: "h1" },
          subheader: { variant: "h5", component: "h2" }
        }}
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1} useFlexGap>
            <Skeleton variant="rounded" width="6%" height={24} sx={{ borderRadius: 4 }} />
            <Skeleton variant="rounded" width="6%" height={24} sx={{ borderRadius: 4 }} />
          </Stack>
          <Divider />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
      </CardContent>
    </Card>
  )
}
