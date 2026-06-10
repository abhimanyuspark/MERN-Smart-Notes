import { lazy } from "react";

const Home = lazy(() => import("./home/Home.jsx"));
const Login = lazy(() => import("./auth/Login.jsx"));
const Register = lazy(() => import("./auth/Register.jsx"));
const NotFound = lazy(() => import("./not-found/NotFound.jsx"));
const Settings = lazy(() => import("./settings/Settings.jsx"));
const NoteChat = lazy(() => import("./note-chat/NoteChat.jsx"));

export { Home, NotFound, Login, Register, Settings, NoteChat };
