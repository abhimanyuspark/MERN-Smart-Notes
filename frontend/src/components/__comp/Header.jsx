import React from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logout } from "../../redux/features/auth";
import Error from "../common/Error";

const Header = () => {
  const { auth, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    await toast.promise(dispatch(logout()).unwrap(), {
      loading: "loading...",
      success: () => {
        navigate("/login");
        return "Successfull";
      },
      error: (err) => err,
    });
  };

  return (
    <nav className="navbar flex justify-between bg-base-100 shadow-sm">
      <Link to={"/"} className="btn btn-ghost text-xl">
        Smart Notes
      </Link>

      {!auth && (
        <div className="flex gap-4">
          <Link className="link" to="/login">
            Login
          </Link>
          <Link className="link" to="/register">
            Register
          </Link>
          <Link className="link" to="/settings">
            Settings
          </Link>
        </div>
      )}

      {auth && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                {auth?.name} <span className="text-xs">Profile</span>
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <button onClick={onLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
