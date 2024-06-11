import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../CSS/Chatroom.scss";
import arrow from "../Assets/Images/Arrow.svg";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import { db } from "../firebase";
import {
	collection,
	query,
	where,
	addDoc,
	onSnapshot,
	orderBy,
} from "firebase/firestore";
function Chatroom() {
	let { name, my_uid, his_uid } = useParams();
	const [inputMessage, setInputMessage] = React.useState("");
	const [sampleData, setSampleData] = React.useState([]);
	const [userSchedule, setUserSchedule] = React.useState({});

	//fetch messages
	useEffect(() => {
		const getData = async () => {
			//referncing the firebase collection
			const userRef = collection(db, "Messages");
			
			const q = query(
				userRef,
				where("uids", "array-contains", my_uid), //Either I have sent the message or the message is meant for me
				orderBy("time")
			);
			//clearing all prev msgs when new msgs are fetched
			setSampleData([]);

            //Sender---->Reciever Format
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messages = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();
                    if (data.uids.includes(his_uid)) {
                        messages.push(data);
                    }
				});
                const sortedMessages = messages.sort(
                    (a, b) => a.createdAt - b.createdAt
                  );
                //Update state with new messages
                setSampleData(sortedMessages)
			});
            return unsubscribe;
		};
            const unsubscribeFromSnapshot = getData();

            //Clean on unmount
            return ()=> unsubscribeFromSnapshot; 
	}, [my_uid, his_uid]);

	//send messages
	const handleSubmit = async (e) => {
		e.preventDefault();
		// message schema 
		let newMessage = {
			uids: [my_uid, his_uid],
			sender_uid: my_uid,
			receiver_uid: his_uid,
			message: inputMessage,
			time: new Date(),
		};
		//setting the input field to clean after message is sent
		setInputMessage("");
        const docRef = await addDoc(collection(db, "Messages"), newMessage);
		console.log("Document written with ID: ", docRef.id);
		//focus on the mesasge that has been sent, to maintain the scroll feature
        //Scroll to the bottom after sending a message
		setTimeout(()=>{
            const element =  document.getElementById("focus");
            element.scrollIntoView();
        }, 100)
	};
	//fetch user schedule in the first render--> That is when the pages load
	useEffect(() => {
		const data = localStorage.getItem("schedule");
        if(data){
            setUserSchedule(JSON.parse(data));
        }	
	},[])

	return (
		<>
			<div className='pages chatroom'>
				<Navbar></Navbar>
				<h1 className='heading'>CHATROOM</h1>
				<div className='outer_chat'>
					<div className='place'>
						<div className='inner_place'>
							<h4>{userSchedule.from}</h4>
						</div>
						<img src={arrow} className='arrow' />
						<div className='inner_place'>
							<h4>{userSchedule.to}</h4>
						</div>
					</div>
					<div className='inner_chat'>
						<h2>{name}</h2>
						{/* <div> */}
						<div className='messages_group'>
							{sampleData.map((data) => {
								if (data.sender_uid == my_uid) {
									return (
										<div className='message_wrapper incoming_wrapper'>
											<div className='message incoming_message'>
												{data.message}
											</div>
										</div>
									);
								} else {
									return (
										<div className='message_wrapper outgoing_wrapper'>
											<div className='message outgoing_message'>
												{data.message}
											</div>
										</div>
									);
								}
							})}
							<div id='focus'></div>
						</div>
						{/* </div> */}
						<div className='send_message'>
							<form onSubmit={handleSubmit}>
								<input
									className='send_input'
									type='text'
									placeholder='Type a message'
									value={inputMessage}
									onChange={(e) => {
										setInputMessage(e.target.value);
									}}
								/>
								<IconButton aria-label='send' type='submit'>
									<SendIcon />
								</IconButton>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Chatroom;
