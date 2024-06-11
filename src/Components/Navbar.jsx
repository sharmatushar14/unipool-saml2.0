import React from "react";
import "../CSS/Navbar.scss";
import { getAuth, signOut } from "firebase/auth";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CreateIcon from "@mui/icons-material/Create";
import ChatIcon from "@mui/icons-material/Chat";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
function Navbar() {
	let navigate = useNavigate();
	const [name, setName] = React.useState(
		JSON.parse(localStorage.getItem("user")).displayName
	);
	const auth = getAuth();
	const handleLogout = () => {
		 signOut(auth)
			.then(() => {
				// Sign-out successful.
				localStorage.clear();
				window.location.pathname = "/";
			})
			.catch((error) => {
				// An error happened.
				// console.log("Error with Navbar", error);
			});
	}
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const user_sched = localStorage.getItem("schedule")
	return (
		<>
			<div className='navbar'>
				<a href = "/" className='navbar_heading'>Unipool</a>
				<div className='inner_nav' onClick={handleClick}>
					<i className='fas fa-user-circle'></i>
					<h3>SETTINGS</h3>
				</div>
			</div>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
				<h3 style={{ padding: "10px 10px" }}> {name}</h3>
				<Divider />
				<MenuItem
					onClick={() => {
						navigate("/from");
						window.location.reload()
					}}>
					<ListItemIcon>
						<CreateIcon fontSize='small' />
					</ListItemIcon>
					Update departure Settings
				</MenuItem>
				<MenuItem
					onClick={() => {
						navigate("/to");
						window.location.reload();
					}}>
					<ListItemIcon>
						<CreateIcon fontSize='small' />
					</ListItemIcon>
					Update arrival Settings
				</MenuItem>

				{user_sched && (
					<MenuItem
						onClick={() => {
							navigate("/chat");
						}}>
						<ListItemIcon>
							<ChatIcon fontSize='small' />
						</ListItemIcon>
						Talk to Co-Passengers
					</MenuItem>
				)}

				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
}

export default Navbar;
