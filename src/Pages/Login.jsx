import React, { useState, useEffect } from "react";
import "../CSS/login.scss";
import loginSVG from "../Assets/Images/loginSVG.svg";
import google_icon from "../Assets/Images/google_icon.svg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
} from "firebase/firestore";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
} from "firebase/auth";

function Login() {
	let errorCode;
	const db = getFirestore();
	const userRef = collection(db, "users");
	const verify_user = async (user) => {
		const uid = user.uid;
		const q = query(userRef, where("uid", "==", uid));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const data = JSON.parse(JSON.stringify(doc.data()));
			localStorage.setItem("schedule", JSON.stringify(data));
			localStorage.setItem("fromSchedule", JSON.stringify(data.fromData));
		});
	};
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
				verify_user(user).then(() => {
					if (localStorage.getItem("schedule")) {
						navigate("/chat");
					} else {
						navigate("/from");
                        window.location.reload();
					}
				});
			})
			.catch((error) => {
				// Handle Errors here.
				 errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log(error);
				// ...
			});
	};
	const [creds, setCreds] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, creds.email, creds.password)
			.then((userCredential) => {
				// Signed in
				setCreds({ email: "", password: "" });
				const user = userCredential.user;
				console.log(user);
				localStorage.setItem("user", JSON.stringify(user));
				navigate("/from");
				window.location.reload();
			})
			.catch((error) => {
			 errorCode = error.code;
				const errorMessage = error.message;
				console.log(error);
			});
	};
	return (
		<div className='login page'>
			<img src={loginSVG} className='loginsvg' alt='login'></img>
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
					<div className='inner_lower_login'>
						<input type="text" className="formText" 
						placeholder="Enter Username" 
						value={creds.email}
						onChange={(e)=>{
							setCreds({...creds,email:e.target.value})
						}}
						/>
						<br/>
						
						{/* <TextField
							id='outlined-basic'
							label='Email'
							type='email'
							variant='outlined'
							fullWidth
							className='form-input'
							color='warning'
							size={"80%"}
							value={creds.email}
							onChange={(e) => {
								setCreds({ ...creds, email: e.target.value });
							}}
							required
						/> */}
					</div>
					{/* <span className="invalid">
							Please Enter Correct Details
						</span> */}
					<div className='inner_lower_login'>
						{/* <TextField
							id='outlined-basic'
							label='Password'
							type='password'
							variant='outlined'
							fullWidth
							className='form-input'
							color='warning'
							size={"80%"}
							value={creds.password}
							onChange={(e) => {
								setCreds({ ...creds, password: e.target.value });
							}}
							required
						/> */}
							<input type="password" className="formText" 
						placeholder="Enter Password" 
						value={creds.password}
						onChange={(e)=>{
							setCreds({...creds,password:e.target.value})
						}}
						/>
						<br />
					</div>
					{/* <span className="invalid">
							Please Enter Correct Details
						</span> */}
					<div className='inner_lower_login'>
						<Button
							variant='contained'
							type='submit'
							fullWidth
							className='Login_button'>
							{"Get Splitting >"}
						</Button>
						
					</div>
					{(errorCode)&&<span className="invalid">
							Please Enter Correct Details
						</span>}
				</form>
				<div className='inner_lower_login login_create_acc'>
					<h6 style={{fontWeight: '500'}}>Dont have an account ?</h6>

					<a href='/signup'>Sign Up</a>
				</div>
			</div>
		</div>
	);
}

export default Login;
