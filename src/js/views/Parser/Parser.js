import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Navbar from '../../components/Navbar/Navbar';
import Logs from '../../components/Logs/Logs';

import './parser.scss';
import { ipcRenderer } from 'electron';

function Parser() {
	const { apiData } = useContext(AuthContext);
	const [group, setGroup] = useState(undefined);
	const [isGroupExist, setIsGroupExist] = useState(false);
	const [amount, setAmount] = useState(0);
	const [left, setLeft] = useState(0);
	const [channelError, setChannelError] = useState(false);

	const handleClick = (e) => {
		e.preventDefault();
		ipcRenderer.send('start', { group: group, session: apiData });
	};

	const handleChange = (e) => {
		setGroup(e.target.value);
	};

	ipcRenderer.on('amount', (e, message) => {
		console.log('Amount: ' + message);
		const value = parseInt(message);
		setAmount(value);
		setLeft(value);
		setChannelError(false);
	});

	ipcRenderer.on('left', (e, message) => {
		const result = left - 1;
		setLeft(result);
		console.log(left);
	});

	ipcRenderer.on('channel-error', () => {
		setChannelError(true);
	});

	return (
		<div className="parser">
			<Navbar />
			<div className="wrapper">
				<div className="group">
					<div className="input-wrapper">
						<label>Group</label>
						<input
							type="text"
							placeholder="channel"
							className={!group ? 'selected' : ''}
							id="group"
							value={group}
							onChange={handleChange}
						/>
					</div>
					{channelError ? (
						<div className="tip">Channel not found</div>
					) : (
						''
					)}
					{!group ? (
						<div className="tip">Enter telegram group link</div>
					) : (
						''
					)}
				</div>
				<div className="logs-wrapper">
					<Logs left={amount} />
				</div>
				<button
					className="button"
					onClick={handleClick}
					disabled={!group}
				>
					Start
				</button>
			</div>
		</div>
	);
}

export default Parser;
