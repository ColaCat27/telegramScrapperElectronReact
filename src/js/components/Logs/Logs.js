import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import StopIcon from '@mui/icons-material/Stop';
import './logs.scss';

function Logs({ isWorking }) {
	// const [data, setData] = useState([]);

	const [data, setData] = useState({
		amount: 0,
		left: 0,
		body: [],
	});

	useEffect(() => {}, [data]);

	// ipcRenderer.on('left', async (e, message) => {
	// 	let value = parseInt(message);
	// 	value = count.amount - value;
	// 	await setCount((prev) => ({ ...prev, left: value }));
	// });

	ipcRenderer.on('amount', async (e, message) => {
		const value = parseInt(message);
		await setData((prev) => ({ ...prev, amount: value, left: value }));
		await setChannelError(false);
	});

	ipcRenderer.on('data', async (e, message) => {
		await setData((prev) => ({
			...prev,
			left: data.amount - message.counter,
			body: message.data,
		}));
		console.log(data.body);
	});

	return (
		<div className="logs">
			<div className="top">
				<div className="status">
					{isWorking ? <RotateRightIcon /> : <StopIcon />}
					<span>{isWorking ? 'Collection data...' : 'Stop'}</span>
				</div>
				<div className="amount">
					Left:<span className="left">{data.left}</span>
				</div>
			</div>
			<div className="bottom">
				<div className="inner-wrapper">
					{data.body.map((item, i) => {
						return (
							<div className="user" key={i}>
								<ContactMailIcon className="icon" />
								<div>
									{item.firstName}
									{', ' + item.lastName},
									{', ' + item.username},{', ' + item.phone}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Logs;
