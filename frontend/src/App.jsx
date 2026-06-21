import React, { Suspense, useEffect } from "react";
import {
  Home,
  NotFound,
  Login,
  Register,
  Settings,
  NotePage,
  ProfilePage,
} from "./pages";
import PageLoader from "./components/common/PageLoader";
import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import UserLayout from "./components/__comp/UserLayout";
import { refresh } from "./redux/features/auth";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./components/__comp/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/note/:id" element={<NotePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </Suspense>
  );
};

export default App;
