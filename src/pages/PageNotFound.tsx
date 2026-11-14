import { Button, Stack, Typography } from "@mui/material"
import { Link } from "react-router"
import ArticleIcon from '@mui/icons-material/Article';

export const PageNotFound = () => {
  return (
    <Stack spacing={2} sx={{ alignItems: "center", py: 2 }}>
      <ArticleIcon sx={{ fontSize: 64, color: "text.secondary" }} />
      <Typography variant="h5" component="h2" color="text.primary">Page Not Found!</Typography>
      <Typography variant="body1" color="text.secondary">Click button below to go back to home page.</Typography>
      <Button component={Link} to="/" variant="contained">Back to home</Button>
    </Stack>
  )

}