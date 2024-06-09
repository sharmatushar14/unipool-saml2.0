import React from "react";
import { Navigate, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
    const [auth, setAuth] = React.useState(JSON.parse(localStorage.getItem("user")))
	return (
		<Route
			{...restOfProps}
			render={(props) =>
				auth ? <Component {...props} /> : <Navigate to='/login' />
			}
		/>
	);
}

export default ProtectedRoute;
