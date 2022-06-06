import React from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Logs from '../../components/Logs/Logs';

import './parser.scss';

function Parser() {
	return (
		<div className="parser">
			<Navbar />
			<div className="wrapper">
				<div className="group">
					<div className="input">
						<label>Group</label>
						<input type="text" placeholder="channel" id="group" />
					</div>
				</div>
				<div className="bottom">
					<Logs />
					<button className="button">Start</button>
				</div>
			</div>
		</div>
	);
}

export default Parser;
