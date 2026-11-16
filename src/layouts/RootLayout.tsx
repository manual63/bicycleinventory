import { Container } from "@mui/material"
import { Outlet } from "react-router"
import { AppHeader } from "../components/AppHeader"
import Toaster from "../components/Toaster"

export const RootLayout = () => {
  return (
    <>
      <AppHeader />
      <Container><Outlet /></Container>
      <Toaster />
    </>
  )
}
