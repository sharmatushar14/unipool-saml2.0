import React from "react";
import { Navigate, Route } from "react-router-dom";

function NotProtectedRoute({ component: Component, ...restOfProps }) {
  const auth = JSON.parse(localStorage.getItem("user"));

  return (
    <Route
      {...restOfProps}
      element={
        auth ? <Navigate to="/from" /> : <Component {...restOfProps} />
      }
    />
  );
}

export default NotProtectedRoute;
