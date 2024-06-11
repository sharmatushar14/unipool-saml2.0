import Card from "../Components/Card";
import React from "react";
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
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
function To() {
	const [open, setOpen] = React.useState(false);
	let navigate = useNavigate();
	const [toValues, settoValues] = React.useState({
		to: null,
		to_date: new Date().toISOString().substring(0, 10),
		to_time: new Date().toLocaleTimeString("en", {
			timeStyle: "short",
			hour12: false,
			timeZone: "IST",
		}),
	});
	const from_data = JSON.parse(localStorage.getItem("fromSchedule"));
	const user = JSON.parse(localStorage.getItem("user"));
	// localStorage.removeItem("fromSchedule");
	const user_data = {
		name: user.providerData[0].displayName,
		uid: user.uid,
	};
	const handleOpen = (e) => {
		const to = e.target.children;
		settoValues({ ...toValues, to: to[0].innerHTML });
		setOpen(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const final_schedule = { ...from_data, ...toValues, ...user_data , fromData: from_data};
		localStorage.setItem("schedule", JSON.stringify(final_schedule));
		localStorage.setItem("fromSchedule", JSON.stringify(final_schedule.fromData));
		try {
			const docRef = await setDoc(doc(db, "users", user_data.uid), final_schedule);
			// console.log("Document written", docRef);
			navigate("/chat");
		} catch (e) {
			console.error("Error adding document: ", e);
		}
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
							label='Reaching Date'
							type='date'
							variant='outlined'
							fullWidth
							style={{ background: " #efa1895b", marginTop: "20px" }}
							color='warning'
							size={"80%"}
							value={toValues.to_date}
							onChange={(e) => {
								settoValues({ ...toValues, to_date: e.target.value });
							}}
							required
						/>
						<TextField
							id='outlined-basic'
							label='Reaching Time'
							type='time'
							variant='outlined'
							fullWidth
							value={toValues.to_time}
							onChange={(e) => {
								settoValues({ ...toValues, to_time: e.target.value });
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
				<h1>GOING TO </h1>
				<div className='inner_from'>
					<div className='form_row'>
						<Card img_src={img1} name='Manipal University' click={handleOpen} />
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

export default To;
