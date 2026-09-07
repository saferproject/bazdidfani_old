import { LinearProgress } from "@mui/material";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./app/routes";

const router = createBrowserRouter(routes);

export default function RouterHandler() {
  return <Suspense fallback={<LinearProgress />}><RouterProvider router={router} /></Suspense>;
}
