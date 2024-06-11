import React from "react";
import { Navigate } from "react-router-dom";

function NotProtectedRoute({ component: Component, ...restOfProps }) {
  const auth = JSON.parse(localStorage.getItem("user"));
  return auth ? <Navigate to="/from" /> : <Component {...restOfProps} />;
}

export default NotProtectedRoute;
