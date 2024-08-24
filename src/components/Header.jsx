import React from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = () => {
  const [user] = useAuthState(auth);
  const location = useLocation(); // Get the current location

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="p-4 bg-blue-600 text-white">
      <h1 className="text-2xl">Restaurant Menu</h1>
      <nav>
        <Link to="/" className="mr-4">
          Home
        </Link>
        {user ? (
          <>
            <Link
              to={`/edit/${location.pathname.split("/")[2]}`}
              className="mr-4"
            >
              Edit Menu
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white p-2 rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="mr-4">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
