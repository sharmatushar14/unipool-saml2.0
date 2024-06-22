import React, { useState, useEffect } from "react";
import "../CSS/chat.scss";
import { db } from "../firebase";
import {
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import useAuth from "../customhook/useAuth";

function Chat() {
	const [spindis, setSpindis] = useState("spin");
	const [finalData, setFinalData] = useState([]);
	const schedule = JSON.parse(localStorage.getItem("schedule"));
	
	//Okta Authentication Process
	const { isAuthenticated, userData } = useAuth(); //Custom Hook

	useEffect(() => {
        //Fetch data from FireStore
		const getData = async () => {
			const userRef = collection(db, "users");
			const q = query(
			  userRef,
			  // Matching the co-passengers with the criteria of same {from, to && to_date}
			  where("final_schedule.from", "==", schedule.from),
			  where("final_schedule.to", "==", schedule.to),
			  where("final_schedule.to_date", "==", schedule.to_date)
			);
			
			const querySnapshot = await getDocs(q);
			const results = [];
			
			querySnapshot.forEach((doc) => {
			  const data = JSON.parse(JSON.stringify(doc.data()));
			  results.push(data);
			});
			
			setFinalData(results);
		  };
			getData().then(() => {
			  setSpindis("nospin");
			});
	},[]);

      // Conditionally render content based on authentication state
    if(!isAuthenticated) {
    return (
		<div class="not-authenticated">
        <h1>You are not authenticated. Please login to proceed.</h1>
        <button onClick={() => window.location.replace('https://unipoolsamlapi.vercel.app/login')}>Login with Okta</button>
        </div>
    );
  }

	return (
		<>
			<CircularProgress color='secondary' className={`spinner ${spindis}`} />
			<div className='pages chat'>
				<h2>Here are your</h2>
				<h1>CO-PASSENGERS</h1>
				<h5
					style={{
						padding: "5px 10px",
						textAlign: "center",
						color: "grey",
						fontWeight: "400",
					}}>
					TIP: You can update your arrival/departure from settings
				</h5>
				<div className='inner_chat'>
					<h3>People close by your timing</h3>
					<div className='inner_data_wrapper'>
						{finalData.length == 1 ? (
							<>
								<lottie-player
									src='https://assets10.lottiefiles.com/packages/lf20_tmbw43jx.json'
									background='transparent'
									speed='1'
									style={{
										width: "100%",
										height: "300px",
									}}
									loop
									autoplay>
									{" "}
								</lottie-player>
									<h4 className = "wait">Sit back and relax, there are more people to Hop in</h4>
							</>
						) : (
							finalData.map((data) => {
								if (data.uid === schedule.nameID) {
									return;
								} else {
									return (
										<div className='inner_data'>
											<div className='data'>
												<h5>{data.uid}</h5>
												<h6>
													{data.to_date}, {data.to_time}
												</h6>
											</div>
											<div className='data'>
												<a
													href={`/chatroom/${data.uid}/${schedule.nameID}/${data.uid}`}>
													CHAT NOW
												</a>
											</div>
										</div>
									);
								}
							})
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default Chat;
