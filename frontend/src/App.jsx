import React, { Suspense, useEffect } from "react";
import { Home, NotFound, Login, Register, Settings, NoteChat } from "./pages";
import Loading from "./components/common/Loading";
import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import UserLayout from "./components/__comp/UserLayout";
import { refresh } from "./redux/features/auth";
import { useDispatch } from "react-redux";
import NotePage from "./pages/note-chat/NotePage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/note/:id" element={<NotePage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* <Route path="/" element={<Home />} /> */}

        {/* <Route path="about" element={<About />} /> */}

        {/* <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          </Route> */}

        {/* <Route path="concerts">
          <Route index element={<ConcertsHome />} />
          <Route path=":city" element={<City />} />
          <Route path="trending" element={<Trending />} />
          </Route> */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </Suspense>
  );
};

export default App;
