import React, { useState, useEffect } from "react";
import "../CSS/login.scss";
import signupSVG from "../Assets/Images/signup.svg";
import google_icon from "../Assets/Images/google_icon.svg";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	updateProfile,
	createUserWithEmailAndPassword,
} from "firebase/auth";
function Signup() {
	localStorage.clear();
	const navigate = useNavigate();
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	const handleGoogleLogin = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				localStorage.setItem("user", JSON.stringify(user));
				console.log(user);
				navigate("/from");
				window.location.reload();
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
				alert("There was an error, please try again" + errorMessage);
			});
	};
	const [creds, setCreds] = useState({
		email: "",
		password: "",
		name: "",
		phone: "",
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		createUserWithEmailAndPassword(auth, creds.email, creds.password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				updateProfile(auth.currentUser, {
					displayName: creds.name,
				})
					.then(() => {
						// Profile updated!
						localStorage.setItem("user", JSON.stringify(auth.currentUser));
						navigate("/from");
						window.location.reload();
					})
					.catch((error) => {
						// An error occurred
						alert("There was an error, please try again" + error);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
				alert(`There was an error please try again : ${errorMessage}`);
			});
	};
	return (
		<div className='login page'>
			<img src={signupSVG} className='loginsvg' alt='login'></img>
			<div className='lower_login'>
				<div
					className='inner_lower_login googleLogin'
					onClick={handleGoogleLogin}>
					<img src={google_icon} className='googleiconsvg'></img>
					<h4>Sign in with Google</h4>
				</div>
				<div className='inner_lower_login orLogin'>
					<h5>Or Follow the Road Less Travelled</h5>
				</div>
				<form onSubmit={handleSubmit}>
					<div className='inner_lower_login' style={{ display: "flex" }}>
						<div style={{ width: "50%", height: "100%", padding: "10px 5px" }}>
							{/* <TextField
								id='outlined-basic'
								label='Name'
								type='text'
								variant='outlined'
								className='form-input'
								color='warning'
								size={"80%"}
								value={creds.name}
								onChange={(e) => {
									setCreds({ ...creds, name: e.target.value });
								}}
								required
							/> */}
								<input type="text" className="formText" 
						placeholder="Enter Name"
						value={creds.name}
						onChange={(e)=>{setCreds({...creds,name:e.target.value})}} />

						</div>
						<div style={{ width: "50%", height: "100%", padding: "10px 5px" }}>
							{/* <TextField
								id='outlined-basic'
								label='Phone'
								type='tel'
								variant='outlined'
								className='form-input'
								color='warning'
								size={"80%"}
								value={creds.phone}
								onChange={(e) => {
									setCreds({ ...creds, phone: e.target.value });
								}}
								required
							/> */}
								<input type="text" className="formText" 
						placeholder="Enter Phone No."
						value={creds.phone}
						onChange={(e)=>{setCreds({...creds,phone:e.target.value})}} />
						</div>
					</div>
					<div className='inner_lower_login' style={{ display: "flex" }}>
						<div style={{ width: "50%", height: "100%", padding: "0px 5px" }}>
							{/* <TextField
								id='outlined-basic'
								label='Email'
								type='email'
								variant='outlined'
								className='form-input'
								color='warning'
								size={"80%"}
								value={creds.email}
								onChange={(e) => {
									setCreds({ ...creds, email: e.target.value });
								}}
								required
							/> */}
								<input type="text" className="formText" 
						placeholder="Enter Email"
						value={creds.email}
						onChange={(e)=>{setCreds({...creds,email:e.target.value})}} />
						</div>
						<div style={{ width: "50%", height: "100%", padding: "0px 5px" }}>
							{/* <TextField
								id='outlined-basic'
								label='Password'
								type='password'
								variant='outlined'
								className='form-input'
								color='warning'
								size={"60%"}
								value={creds.password}
								onChange={(e) => {
									setCreds({ ...creds, password: e.target.value });
								}}
								required
							/> */}
								<input type="password" className="formText" 
						placeholder="Enter Password" 
						value={creds.password}
						onChange={(e)=>{setCreds({...creds,password:e.target.value})}}/>
						</div>
					</div>
					<div className='inner_lower_login'>
						<Button
							variant='contained'
							type='submit'
							fullWidth
							className='Login_button'>
							{"Start Your Journey >"}
						</Button>
					</div>
				</form>
				<div className='inner_lower_login login_create_acc'>
					<h6 style={{fontWeight: '500'}}>Already have an account ?</h6>

					<a href='/login'>Sign In instead</a>
				</div>
			</div>
		</div>
	);
}

export default Signup;
