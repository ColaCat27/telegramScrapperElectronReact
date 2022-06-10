import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import StopIcon from '@mui/icons-material/Stop';
import './logs.scss';

class Logs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			amount: 0,
			left: 0,
			body: [],
		};
	}

	componentDidMount() {
		ipcRenderer.on('amount', (e, message) => {
			const value = parseInt(message);
			this.setState((prev) => ({ ...prev, amount: value, left: value }));
			setChannelError(false);
		});

		ipcRenderer.on('data', (e, message) => {
			this.setState((prev) => ({
				...prev,
				left: prev.amount - message.counter,
				body: prev.body.concat(message.data),
			}));
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('amount');
		ipcRenderer.removeListener('data');
	}
	render() {
		return (
			<div className="logs">
				<div className="top">
					<div className="status">
						{this.state.isWorking ? (
							<RotateRightIcon />
						) : (
							<StopIcon />
						)}
						<span>
							{this.state.isWorking
								? 'Collection data...'
								: 'Stop'}
						</span>
					</div>
					<div className="amount">
						Left:<span className="left">{this.state.left}</span>
					</div>
				</div>
				<div className="bottom">
					<div className="inner-wrapper">
						{this.state.body.map((item, i) => {
							return (
								<div className="user" key={i}>
									<ContactMailIcon className="icon" />
									<div>
										{item.firstName}
										{', ' + item.lastName},
										{', ' + item.username},
										{', ' + item.phone}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Logs;
