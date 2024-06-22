import Card from "../Components/Card";
import React, { useState} from "react";
import useAuth from "../customhook/useAuth";
import "../CSS/From.scss";
import img1 from "../Assets/Images/muj.jpg";
import img2 from "../Assets/Images/airport.jpg";
import img3 from "../Assets/Images/rail.jpg";
import img4 from "../Assets/Images/bus.jpg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../CSS/Unauth.css";
import { useNavigate } from "react-router-dom";

function From() {
  const [open, setOpen] = useState(false);
  const [fromValues, setFromValues] = useState({
    from: null,
    from_date: new Date().toISOString().substring(0, 10),
    from_time: new Date().toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: false,
      timeZone: "IST",
    }),
  });

  const navigate = useNavigate();
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

  console.log(userData);

  const handleOpen = (dataname) => {
    setFromValues((prevValues) => ({ ...prevValues, from: dataname }));
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("fromValues before setting to localStorage: ", fromValues);
    localStorage.setItem("fromSchedule", JSON.stringify(fromValues));
    console.log("fromSchedule in localStorage: ", localStorage.getItem("fromSchedule"));
    navigate("/to");
  };

  const handleClose = () => setOpen(false);

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

      // Redirect to the homepage after logout
      window.location.href = process.env.REACT_APP_FRONTENDROUTE;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  console.log(userData.nameID);

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
                className='from_button'>
                Next {" >"}
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
      <div className='page from'>
        <h2>Welcome {userData && userData.nameID}</h2>
        <button className="left-corner-button" onClick={handleLogout}>Logout ↩</button>
        <h2>Where are you </h2>
        <h1>COMING FROM </h1>
        <div className='inner_from'>
          <div className='form_row'>
            <Card img_src={img1} name='Manipal University' click={() => handleOpen('Manipal University')} />
            <Card img_src={img2} name='Airport' click={() => handleOpen('Airport')} />
          </div>
          <div className='form_row'>
            <Card img_src={img3} name='Railway Station' click={() => handleOpen('Railway Station')} />
            <Card img_src={img4} name='Bus Station' click={() => handleOpen('Bus Station')} />
          </div>
        </div>
      </div>
    </>
  );
}

export default From;
