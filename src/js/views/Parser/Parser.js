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
	const [channelError, setChannelError] = useState(false);
	const [isWorking, setIsWorking] = useState(false);

	const handleClick = (e) => {
		e.preventDefault();
		ipcRenderer.send('start', { group: group, session: apiData });
		setIsWorking(true);
	};

	const handleChange = (e) => {
		setGroup(e.target.value);
	};

	ipcRenderer.on('channel-error', () => {
		setChannelError(true);
	});

	ipcRenderer.on('clear-group', () => {
		setIsWorking(false);
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
					<Logs isWorking={isWorking} />
				</div>

				{isWorking ? (
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
