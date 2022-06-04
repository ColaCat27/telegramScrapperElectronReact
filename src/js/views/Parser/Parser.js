import React from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Logs from '../../components/Logs/Logs';

import './parser.scss';

function Parser() {
	return (
		<div className="parser">
			<Navbar />
			<div className="wrapper">
				<div className="group">
					<Input label="Group" placeholder="channel" />
				</div>
				<div className="bottom">
					<Logs />
					<Button text="Start" />
				</div>
			</div>
		</div>
	);
}

export default Parser;
