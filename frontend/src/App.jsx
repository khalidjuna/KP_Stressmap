import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import "bootstrap/dist/css/bootstrap.min.css";

import { getBrowserId } from "./Utils/FingerPrintUtil.js";
import PWABadge from "./PWABadge.jsx";
import store from "./store.js";

//Maps
import MapsView from "./Pages/Maps/MapsView.jsx";

// auth...
import LoginPage from "./Pages/Auth/Login.jsx";
import RegisterPage from "./Pages/Auth/Register.jsx";
import Pendaftaran from "./Pages/Auth/Pendaftaran.jsx";
// landing Page
import Home from "./Pages/LandingPages/LandingPage.jsx";

//Admin Panel
import AdminNavbar from "./Pages/Panels/Admin/AdminNavbar.jsx";
import ViewUser from "./Pages/Panels/Admin/ViewUser.jsx";
import Maps from "./Pages/Panels/Admin/Maps.jsx";
import AddUser from "./Pages/Panels/Admin/AddUser.jsx";
//User Panel
import UserPage from "./Pages/Panels/User/UserPage.jsx";
import UploadData from "./Pages/Panels/User/UploadData.jsx";
import Profile from "./Pages/Panels/User/Profile.jsx";
import Dashboard from "./Pages/Panels/User/Dashboard.jsx";
// error...
import { Spinner } from "./Components/LoaderComponent.jsx";

const router = createBrowserRouter([
  {
    path: "/stressmap",
    element: <Home />,
  },

  {
    path: "/stressmap/maps-view",
    element: <MapsView />,
  },

  //Admin
  {
    path: "/stressmap/admin",
    element: <AdminNavbar />,
  },

  {
    path: "/stressmap/admin/view-user",
    element: <ViewUser />,
  },

  {
    path: "/stressmap/admin/map",
    element: <Maps />,
  },

  {
    path: "/stressmap/admin/add-user",
    element: <AddUser />,
  },
  {
    path: "/stressmap/user/map",
    element: <UserPage />,
  },

  {
    path: "/stressmap/user/upload-data",
    element: <UploadData />,
  },

  {
    path: "/stressmap/user/edit-profile",
    element: <Profile />,
  },

  {
    path: "/stressmap/user/dashboard",
    element: <Dashboard/>,
  },

  // {
  //   path: "/maps-view",
  //   element: <MapsView />,
  // },

  // auth...
  {
    path: "/stressmap/login",
    element: <LoginPage />,
  }, 

  {
    path: "/stressmap/register",
    element: <RegisterPage />,
  },

  {
    path: "/pendaftaran",
    element: <Pendaftaran />,
  },

//   {
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//       {
//         path: "/register",
//         element: <RegisterPage />,
//       },
//       {
//         path: "/forgot-password",
//         element: <ForgotPasswordPage />,
//       },
//     ],
//   },
//   {
//     path: "/panel",
//     element: <PanelLayout />, // small - auto layout
//     children: [
//       {
//         path: "dashboard",
//         element: <DashboardPage />,
//       },

//       {
//         path: "daily-report",
//         element: <DailyReport />,
//       },

//       {
//         path: "absens-children",
//         element: <AbsenReport />,
//       },

//       // {
//       //   path: "role",
//       //   element: <Role />,
//       // },
//     ],
//   },

//   // error...
//   {
//     path: "*",
//     element: <PageNotFoundPage />,
//   },
]);

function App() {
  const { setStore } = store();

  const [isReady, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const browser_id = await getBrowserId();
      console.log({ browser_id });
      setStore({
        browser_id,
      });
      setReady(true);
    })();
  }, [setStore]);

  if (!isReady) return <Spinner title={"please wait..."} />;
  return (
    <>
      <RouterProvider router={router} />

      <PWABadge />
    </>
  );
}

export default App;
