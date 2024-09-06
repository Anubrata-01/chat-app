/* eslint-disable react/prop-types */
import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAtom, useAtomValue } from "jotai";
import { userInfoAtom } from "./stores/auth-slice";
import { useState, useEffect } from "react";
import { GETUSERDATA_URL } from "./constant";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const userInfo = useAtomValue(userInfoAtom);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useAtomValue(userInfoAtom);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/profile" /> : children;
};

function App() {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfoData = async () => {
      try {
        const response = await fetch(GETUSERDATA_URL, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserInfoData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <AuthRoute>
          <Auth />
        </AuthRoute>
      ),
    },
    {
      path: "/chat",
      element: (
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/auth" />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

