import React from "react";
import "../CSS/card.scss";
function Card({ img_src, name, click }) {
	return (
		<div className='card' onClick={click} dataname={name}>
			<img src={img_src} className='card_image' />
			<div className='overlay'>
				<h1>{name}</h1>
			</div>
		</div>
	);
}

export default Card;
