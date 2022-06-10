import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Navbar from '../../components/Navbar/Navbar';
import Logs from '../../components/Logs/Logs';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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
		setGroup(e.target.value.replace(/(\W|https\:\/\/t\.me)/g, ''));
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
						<Box
							component="form"
							sx={{
								'& > :not(style)': { m: 1, width: '25ch' },
							}}
							noValidate
							autoComplete="off"
						>
							<TextField
								id="standard-basic"
								label="Group"
								variant="standard"
								autoFocus={true}
								value={group}
								onChange={handleChange}
							/>
						</Box>
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
