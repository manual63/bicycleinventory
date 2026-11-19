import { createBrowserRouter } from "react-router";
import { WelcomePage } from "./pages/WelcomePage";
import { BikesPage } from "./pages/BikesPage";
import { PageNotFound } from "./pages/PageNotFound";
import { RootLayout } from "./layouts/RootLayout";
import { TirePressurePage } from "./pages/TirePressurePage";
import { BikeDetailPage } from "./pages/BikeDetailPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "bikes", element: <BikesPage /> },
      { path: "bikes/:bikeId", element: <BikeDetailPage /> },
      { path: "tire-pressure", element: <TirePressurePage /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);
