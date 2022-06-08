import React, { useState, useContext, useEffect } from 'react';
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

	const [authError, setAuthError] = useState(false);
	const [phoneError, setPhoneError] = useState(false);
	const [codeError, setCodeError] = useState(false);

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

		switch (target.innerText) {
			case 'START':
				ipcRenderer.send('login', credentials);
				setAuthError(false);
				setConfirm(true);
				break;
			case 'SEND':
				setPhoneData((prev) => ({ ...prev, sended: false }));
				ipcRenderer.send('phone', phoneData);

				const phoneNumber = async () => {
					return await new Promise((resolve, reject) => {
						ipcRenderer.on('phone-correct', (_, message) => {
							resolve(message);
						});
					});
				};

				const result = await phoneNumber();
				if (result) {
					setPhoneError(false);
					setPhoneData((prev) => ({
						...prev,
						phone: '',
						sended: true,
					}));
				} else {
					setPhoneData((prev) => ({
						...prev,
						phone: '',
						sended: false,
					}));
					setPhoneError(true);
				}

				break;
			case 'CONFIRM':
				console.log(phoneData);
				ipcRenderer.send('code', phoneData);

				break;
			case 'BACK':
				setConfirm(false);
				setPhoneData((prev) => ({ ...prev, sended: false }));
				ipcRenderer.send('destroy');
				break;
			default:
				break;
		}
	};

	ipcRenderer.on('authData-error', (e, message) => {
		setAuthError(true);
		setConfirm(false);
		// dispatch('LOGIN_FAILURE', message);
	});

	ipcRenderer.on('login-success', (e, message) => {
		console.log('Событие login-success');
		dispatch('LOGIN_SUCCESS', message);
		navigate('/');
	});

	ipcRenderer.on('phone-error', (e, message) => {
		setPhoneData((prev) => ({ ...prev, phone: '', sended: false }));
		console.log('phone number incorrect');
	});

	ipcRenderer.on('code-error', (e, message) => {
		setCodeError(true);
		setPhoneData((prev) => ({ ...prev, code: '' }));
		console.log('code incorrect');
	});

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
					<div className="btn-wrap">
						<button className="back" onClick={handleClick}>
							BACK
						</button>
					</div>
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
					{phoneError ? (
						<span className="error">
							Такого телефона не существует, укажите правильный
							телефон
						</span>
					) : (
						''
					)}
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
					{codeError ? (
						<span className="error">
							Не верный код, введите код повторно или вернитесь
							назад
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
