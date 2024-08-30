import { createBrowserRouter } from "react-router-dom";

import { Home, Login, Register, Dashboard, CarNew, CarDetails } from "./pages";
import { Layout } from "./components/layout";
import { Private } from "./routes/private";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/dashboard",
        element: (
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        path: "/dashboard/car-new",
        element: (
          <Private>
            <CarNew />
          </Private>
        ),
      },
      { path: "/car-details/:id", element: <CarDetails /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
