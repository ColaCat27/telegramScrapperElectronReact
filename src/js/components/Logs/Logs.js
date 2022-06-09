import React, { useState } from 'react';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import StopIcon from '@mui/icons-material/Stop';
import './logs.scss';

function Logs({ left, data, isWorking }) {
	return (
		<div className="logs">
			<div className="top">
				<div className="status">
					{isWorking ? <RotateRightIcon /> : <StopIcon />}
					<span>{isWorking ? 'Collection data...' : 'Stop'}</span>
				</div>
				<div className="amount">
					Left:<span className="left">{left}</span>
				</div>
			</div>
			<div className="bottom">
				<div className={isWorking ? 'result' : 'dnone'}>
					<ContactMailIcon className="icon" />
					{data.map((item) => {
						<span>
							{item.firstName +
								', ' +
								item.lastName +
								', ' +
								item.username +
								', ' +
								item.phone}
						</span>;
					})}
				</div>
			</div>
		</div>
	);
}

export default Logs;
