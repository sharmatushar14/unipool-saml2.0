import Card from "../Components/Card";
import React, { useRef } from "react";
import Navbar from "../Components/Navbar";
import "../CSS/From.scss";
import img1 from "../Assets/Images/muj.jpg";
import img2 from "../Assets/Images/airport.jpg";
import img3 from "../Assets/Images/rail.jpg";
import img4 from "../Assets/Images/bus.jpg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
function From() {
	const placeRef = useRef();
	const [open, setOpen] = React.useState(false);
	const [fromValues, setFromValues] = React.useState({
		from: null,
		from_date: new Date().toISOString().substring(0, 10),
		from_time: new Date().toLocaleTimeString("en", {
			timeStyle: "short",
			hour12: false,
			timeZone: "IST",
		}),
	});
	const handleOpen = async (e) => {
		const from = await e.target.parentElement.getAttribute("dataname");
		setTimeout(() => {
			// console.log(from);
			setFromValues({ ...fromValues, from: from })
		},[300])
		setOpen(true);
	};
	let navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		localStorage.setItem("fromSchedule", JSON.stringify(fromValues));
		navigate("/to");
	};
	const handleClose = () => setOpen(false);
	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<div className='from_modal'>
					<h3>Your Schedule</h3>
					<h4>We'll Match you according to your time</h4>
					<form onSubmit={handleSubmit}>
						<TextField
							id='outlined-basic'
							label='Leaving Date'
							type='date'
							variant='outlined'
							fullWidth
							style={{ background: " #efa1895b", marginTop: "20px" }}
							color='warning'
							size={"80%"}
							value={fromValues.from_date}
							onChange={(e) => {
								setFromValues({ ...fromValues, from_date: e.target.value });
							}}
							required
						/>
						<TextField
							id='outlined-basic'
							label='Leaving Time'
							type='time'
							variant='outlined'
							fullWidth
							value={fromValues.from_time}
							onChange={(e) => {
								setFromValues({ ...fromValues, from_time: e.target.value });
							}}
							style={{ background: " #efa1895b", marginTop: "20px" }}
							color='warning'
							size={"80%"}
							required
						/>
						<Box textAlign='center'>
							<Button
								variant='contained'
								type='submit'
								// fullWidth
								className='from_button'>
								Next {" >"}
							</Button>
						</Box>
					</form>
				</div>
			</Modal>
			<div className='page from'>
				<Navbar />
				<h2>Where are you </h2>
				<h1>COMING FROM </h1>
				<div className='inner_from'>
					<div className='form_row'>
						<Card img_src={img1} name='Manipal University' click={handleOpen} />
						{/* This name has been captured from getAttribute('dataname') */}
						<Card img_src={img2} name='Airport' click={handleOpen} />
					</div>
					<div className='form_row'>
						<Card img_src={img3} name='Railway Station' click={handleOpen} />
						<Card img_src={img4} name='Bus Station' click={handleOpen} />
					</div>
				</div>
			</div>
		</>
	);
}

export default From;
