import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
    const auth = JSON.parse(localStorage.getItem("user"))
	return auth ? <Component {...restOfProps} /> : <Navigate to="/login"/>
}

export default ProtectedRoute;
