import React from 'react';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import './logs.scss';

function Logs() {
	return (
		<div className="logs">
			<div className="top">
				<div className="status">
					<RotateRightIcon />
					<span>Collecting data...</span>
				</div>
				<div className="amount">
					Left: <span className="left">51251</span>
				</div>
			</div>
			<div className="bottom">
				<div className="result">
					<ContactMailIcon className="icon" />
					User:
					<span className="data">
						Name, Lastname, Username, Phone
					</span>
				</div>
			</div>
		</div>
	);
}

export default Logs;
