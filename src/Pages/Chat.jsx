import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import "../CSS/chat.scss";
import { db } from "../firebase";
import {
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { CircularProgress } from "@mui/material";
function Chat() {
	const [spindis, setSpindis] = useState("spin");
	const [finalData, setFinalData] = useState([]);
	const schedule = JSON.parse(localStorage.getItem("schedule"));
	useEffect(() => {
		const getData = async () => {
			const userRef = collection(db, "users");
			const q = query(
				userRef,
				//Matching the co-passengers with the criteria of same {from, to && to_date}
				where("from", "==", schedule.from),
				where("to", "==", schedule.to),
				where("to_date", "==", schedule.to_date)
			);
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				const data = JSON.parse(JSON.stringify(doc.data()));
				setFinalData((prev) => [...prev, data]);
			});
		};
		getData().then(() => {
			setSpindis("nospin");
		
		});
	},[]);

	return (
		<>
			<CircularProgress color='secondary' className={`spinner ${spindis}`} />
			<div className='pages chat'>
				<Navbar />
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
						{/* {console.log(finalData)} */}
						{finalData.length == 1 ? (
							<>
								<lottie-player
									src='https://assets10.lottiefiles.com/packages/lf20_tmbw43jx.json'
									background='transparent'
									speed='1'
									// style='width: 300px; height: 300px;'
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
								if (data.name == schedule.name) {
									return;
								} else {
									return (
										<div className='inner_data'>
											<div className='data'>
												<h5>{data.name}</h5>
												<h6>
													{data.to_date}, {data.to_time}
												</h6>
											</div>
											<div className='data'>
												<a
													href={`/chatroom/${data.name}/${schedule.uid}/${data.uid}`}>
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
				{/* <div className='inner_chat'>
				<h3>People travelling on same date</h3>
				<div className='inner_data_wrapper'>
					{finalData.map((data) => {
						if (data.name == schedule.name) {
							return;
						} else {
							return (
								<div className='inner_data'>
									<div className='data'>
										<h5>{data.name}</h5>
										<h6>
											{data.to_date}, {data.to_time}
										</h6>
									</div>
									<div className='data'>
										<a>CHAT NOW</a>
									</div>
								</div>
							);
						}
					})}
				</div>
			</div> */}
			</div>
		</>
	);
}

export default Chat;
