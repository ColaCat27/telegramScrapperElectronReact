import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import Navbar from '../../components/Navbar/Navbar';
import Logs from '../../components/Logs/Logs';
import CircularProgress from '@mui/material/CircularProgress';

import './parser.scss';
import { ipcRenderer } from 'electron';

function Parser() {
	const { apiData } = useContext(AuthContext);
	const [group, setGroup] = useState(undefined);
	const [count, setCount] = useState({
		amount: 0,
		left: 0,
	});
	const [channelError, setChannelError] = useState(false);
	const [data, setData] = useState([]);

	const handleClick = (e) => {
		e.preventDefault();
		ipcRenderer.send('start', { group: group, session: apiData });
	};

	const handleChange = (e) => {
		setGroup(e.target.value);
	};

	ipcRenderer.on('amount', async (e, message) => {
		const value = parseInt(message);
		await setCount(() => ({ amount: value, left: value }));
		await setChannelError(false);
	});

	ipcRenderer.on('left', async (e, message) => {
		let value = parseInt(message);
		value = count.amount - value;
		await setCount((prev) => ({ ...prev, left: value }));
	});

	ipcRenderer.on('channel-error', () => {
		setChannelError(true);
	});

	ipcRenderer.on('data', async (e, message) => {
		console.log(message);
		await setData((prev) => prev.concat(message));
		console.log(data);
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
					<Logs
						left={count.left}
						data={data}
						isWorking={count.left ? true : false}
					/>
				</div>

				{count.amount ? (
					<div className="progress">
						<CircularProgress />
					</div>
				) : (
					<button
						className="button"
						onClick={handleClick}
						disabled={!group}
					>
						Start
					</button>
				)}
			</div>
		</div>
	);
}

export default Parser;
