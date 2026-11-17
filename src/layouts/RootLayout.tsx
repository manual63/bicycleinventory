import { Container } from "@mui/material"
import { Outlet } from "react-router"
import Toaster from "../components/feedback/Toaster"
import { AppHeader } from "../components/layout/AppHeader"

export const RootLayout = () => {
  return (
    <>
      <AppHeader />
      <Container><Outlet /></Container>
      <Toaster />
    </>
  )
}
