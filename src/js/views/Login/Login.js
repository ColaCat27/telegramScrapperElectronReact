import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { ipcRenderer } from 'electron';

import './login.scss';
import { MpSharp } from '@mui/icons-material';

function Login() {
	const [credentials, setCredentials] = useState({
		id: undefined,
		hash: undefined,
	});

	const [confirm, setConfirm] = useState(false);

	const [authError, setAuthError] = useState(false);

	const [phoneData, setPhoneData] = useState({
		phone: undefined,
		code: undefined,
		sended: false,
	});

	const { loading, error, dispatch } = useContext(AuthContext);

	const navigate = useNavigate();

	const handleClick = async (e) => {
		e.preventDefault();
		const target = e.target;
		let result;

		switch (target.innerText) {
			case 'START':
				result = ipcRenderer.sendSync('login', credentials);
				if (result.message) {
					setAuthError(true);
					setCredentials({ id: '', hash: '' });
					return;
				}
				setAuthError(false);
				setConfirm(true);

				// dispatch({
				// 	type: 'LOGIN_SUCESS',
				// 	payload: JSON.stringify(credentials),
				// });
				// navigate('/');
				break;
			case 'SEND':
				console.log('Send phone');
				result = ipcRenderer.sendSync('phone', phoneData);
				if (result.message) {
					setAuthError(true);
					// setPhoneData({ phone: '' });
					return;
				}
				setPhoneData((prev) => ({ ...prev, sended: true }));
				setAuthError(false);
				break;
			case 'CONFIRM':
				console.log(phoneData);
				ipcRenderer.send('code', phoneData);
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
		} else {
			setPhoneData((prev) => ({
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
							value={credentials.id}
						/>
					</div>
					<div className="input">
						<label>API HASH</label>
						<input
							type="text"
							placeholder="1t1tg43g3yyghHT534TF"
							id="hash"
							onChange={handleChange}
							value={credentials.hash}
						/>
					</div>
					<button className="button" onClick={handleClick}>
						Start
					</button>
					{authError ? (
						<span className="error">
							Ошибка, неправильный API ID или API HASH
						</span>
					) : (
						''
					)}
				</div>
				<div className={confirm ? 'confirm' : 'confirm hidden'}>
					<div className="input">
						<label>PHONE</label>
						<input
							type="text"
							placeholder="380502221111"
							id="phone"
							onChange={handleChange}
							value={phoneData.phone}
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
							value={phoneData.code}
						/>
					</div>
					<button className="button" onClick={handleClick}>
						{phoneData.sended ? 'Confirm' : 'Send'}
					</button>
					{authError ? (
						<span className="error">
							Ошибка, неправильный телефон
						</span>
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
}

export default Login;
