import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { ipcRenderer } from 'electron';

import './login.scss';

function Login() {
	const [credentials, setCredentials] = useState({
		id: undefined,
		hash: undefined,
	});

	const [confirm, setConfirm] = useState(false);

	const [phoneData, setPhoneData] = useState({
		phone: undefined,
		code: undefined,
		sended: false,
	});

	const { loading, error, dispatch } = useContext(AuthContext);

	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();
		const target = e.target;

		switch (target.innerText) {
			case 'START':
				ipcRenderer.send('login', credentials);
				setConfirm(true);

				// dispatch({
				// 	type: 'LOGIN_SUCESS',
				// 	payload: JSON.stringify(credentials),
				// });
				// navigate('/');
				break;
			case 'SEND':
				setPhoneData((prev) => ({ ...prev, sended: true }));
				console.log(`Phone data:${phoneData}`);
				break;
			case 'CONFIRM':
				console.log('All ok');
				break;
			default:
				break;
		}
	};

	const handleChange = (e) => {
		if (e.target.id == 'id' || e.target.id == 'hash') {
			setCredentials((prev) => ({
				...prev,
				[e.target.id]: e.target.value,
			}));
		}
	};

	return (
		<div className="login">
			<div className="wrapper">
				<div className={confirm ? 'api hidden' : 'api'}>
					<div className="input">
						<label>API ID</label>
						<input
							type="text"
							placeholder="25151"
							id="id"
							onChange={handleChange}
						/>
					</div>
					<div className="input">
						<label>API HASH</label>
						<input
							type="text"
							placeholder="1t1tg43g3yyghHT534TF"
							id="hash"
							onChange={handleChange}
						/>
					</div>
					<button className="button" onClick={handleClick}>
						Start
					</button>
				</div>
				<div className={confirm ? 'confirm' : 'confirm hidden'}>
					<div className="input">
						<label>PHONE</label>
						<input
							type="text"
							placeholder="380502221111"
							id="phone"
							onChange={handleChange}
						/>
					</div>
					<div
						className={phoneData.sended ? 'input' : 'input hidden'}
					>
						<label>CODE</label>
						<input
							type="text"
							placeholder="1255"
							id="code"
							onChange={handleChange}
						/>
					</div>
					<button className="button" onClick={handleClick}>
						{phoneData.sended ? 'Confirm' : 'Send'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
