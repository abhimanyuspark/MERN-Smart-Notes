import React from "react";
import Header from "./Header";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";

const UserLayout = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className="h-screen w-screen" data-theme={theme}>
      <header className="w-full h-16">
        <Header />
      </header>

      <main className="p-4 h-[calc(100vh-4rem)] w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
