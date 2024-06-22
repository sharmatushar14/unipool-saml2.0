import { query, where, getDocs, updateDoc } from "firebase/firestore";
import Card from "../Components/Card";
import React from "react";
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
import useAuth from "../customhook/useAuth";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

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

  const { isAuthenticated, userData } = useAuth(); //Custom Hook
  // Conditionally render content based on authentication state
  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h1>You are not authenticated. Please login to proceed.</h1>
        <button onClick={() => window.location.replace(process.env.REACT_APP_BACKENDLOGIN)}>Login with Okta</button>
      </div>
    );
  }

  const from_data = JSON.parse(localStorage.getItem("fromSchedule"));

  const handleOpen = async (e) => {
    const to = await e.target.parentElement.getAttribute("dataname"); // Manipal, Airport etc.
    setTimeout(() => {
      settoValues({ ...toValues, to: to });
    }, 300);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
	const final_schedule = { ...from_data, ...toValues, ...userData, fromData: from_data };
	console.log(final_schedule);
	localStorage.setItem("schedule", JSON.stringify(final_schedule));
	localStorage.setItem("fromSchedule", JSON.stringify(final_schedule.fromData));
  
	const q = query(collection(db, "users"), where("uid", "==", userData.nameID));
	const querySnapshot = await getDocs(q);
	if (!querySnapshot.empty) {
	  // Update existing document
	  querySnapshot.forEach(async (doc) => {
		await updateDoc(doc.ref, {
		  final_schedule
		});
		console.log(`Document updated with ID: ${doc.id}`);
		navigate("/chat");
	  });
	} else {
	  // Create a new document
	  try {
		const docRef = await addDoc(collection(db, "users"), {
		  uid: userData.nameID,
		  final_schedule
		});
		console.log(`New document added with ID: ${docRef.id}`);
		navigate("/chat");
	  } catch (e) {
		console.error("Error adding document: ", e);
	  }
	}
  };
  

  const handleLogout = async () => {
    try {
      // Send a request to the backend to log out
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ nameID: userData.nameID }),
      });

      // Redirect the user to the homepage after logout
      window.location.href = process.env.REACT_APP_FRONTENDHOME;
    } catch (error) {
      console.error('Error logging out:', error);
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
                className='from_button'>
                Next {" >"}
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
      <div className='page from'>
        <button className="left-corner-button" onClick={handleLogout}>Logout ↩</button>
        <h2>Where are you </h2>
        <h1>GOING TO </h1>
        <div className='inner_from'>
          <div className='form_row'>
            <Card img_src={img1} name='Manipal University' click={handleOpen} dataname='Manipal University' />
            <Card img_src={img2} name='Airport' click={handleOpen} dataname='Airport' />
          </div>
          <div className='form_row'>
            <Card img_src={img3} name='Railway Station' click={handleOpen} dataname='Railway Station' />
            <Card img_src={img4} name='Bus Station' click={handleOpen} dataname='Bus Station' />
          </div>
        </div>
      </div>
    </>
  );
}

export default To;
