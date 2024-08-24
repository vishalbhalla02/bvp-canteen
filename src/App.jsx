// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import EditMenu from "./pages/EditMenu";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import RestaurantMenu from "./pages/RestaurantMenu";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
        <Route
          path="/edit/:restaurantId"
          element={<PrivateRoute element={<EditMenu />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
