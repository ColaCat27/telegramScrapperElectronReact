import React, { useState } from 'react';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import StopIcon from '@mui/icons-material/Stop';
import DataArrayIcon from '@mui/icons-material/DataArray';
import './logs.scss';

function Logs({ left }) {
	const [data, setData] = useState({
		isWorking: false,
		count: 0,
	});

	return (
		<div className="logs">
			<div className="top">
				<div className="status">
					{data.isWorking ? <RotateRightIcon /> : <StopIcon />}
					<span>
						{data.isWorking ? 'Collection data...' : 'Stop'}
					</span>
				</div>
				<div className="amount">
					Left:<span className="left">{left}</span>
				</div>
			</div>
			<div className="bottom">
				<div className={data.isWorking ? 'result' : 'dnone'}>
					<ContactMailIcon className="icon" />
					<span className="data">
						Name, Lastname, Username, Phone
					</span>
					<span>Logs</span>
				</div>
			</div>
		</div>
	);
}

export default Logs;
