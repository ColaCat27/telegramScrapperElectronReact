import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { ipcRenderer } from 'electron';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

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

	const [loader, setLoader] = useState(false);

	const { loading, error, dispatch } = useContext(AuthContext);

	const navigate = useNavigate();
	let result;

	const handleClick = async (e) => {
		e.preventDefault();
		const target = e.target;

		switch (target.innerText) {
			case 'START':
				ipcRenderer.send('login', credentials);
				setLoader(true);
				const authData = async () => {
					return await new Promise((resolve, reject) => {
						ipcRenderer.on('data-correct', (_, message) => {
							resolve(message);
						});
					});
				};
				result = await authData();
				console.log('result: ' + result);
				if (result) {
					setLoader(false);
					setAuthError(false);
					setConfirm(true);
				} else {
					setLoader(false);
					setAuthError(true);
					setConfirm(false);
					setCredentials({ id: '', hash: '' });
				}
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

				result = await phoneNumber();
				if (result) {
					setPhoneError(false);
					setPhoneData((prev) => ({
						...prev,
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
				ipcRenderer.send('code', phoneData);

				const code = async () => {
					return await new Promise((resolve, reject) => {
						ipcRenderer.on('code-correct', (_, message) => {
							resolve(message);
						});
					});
				};

				result = await code();

				if (!result) {
					setCodeError(true);
					setPhoneData((prev) => ({ ...prev, code: '' }));
				}
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

	ipcRenderer.on('login-success', async (e, message) => {
		console.log('Событие login-success');
		console.log(message);
		dispatch({
			type: 'LOGIN_SUCCESS',
			payload: Object.assign(credentials, { session: message }),
		});
		navigate('/');
	});

	const handleChange = (e) => {
		if (authError) {
			setAuthError(false);
		} else if (phoneError) {
			setPhoneError(false);
		} else if (codeError) {
			setCodeError(false);
		}
		let value = e.target.value.replace(/\W/g, '');

		if (e.target.id == 'id' || e.target.id == 'hash') {
			setCredentials((prev) => ({
				...prev,
				[e.target.id]: value,
			}));
		} else {
			setPhoneData((prev) => ({
				...prev,
				[e.target.id]: value,
			}));
		}
	};

	return (
		<div className="login">
			<div className="wrapper">
				<div className={confirm ? 'api hidden' : 'api'}>
					<Box
						component="form"
						sx={{
							'& > :not(style)': { m: 1, width: '43ch' },
						}}
						noValidate
						autoComplete="off"
					>
						<TextField
							id="id"
							label="API ID"
							variant="standard"
							autoFocus={true}
							value={credentials.id}
							onChange={handleChange}
						/>
						<TextField
							id="hash"
							label="API HASH"
							variant="standard"
							value={credentials.hash}
							onChange={handleChange}
						/>
					</Box>

					{loader ? (
						<div className="progress">
							<CircularProgress />
						</div>
					) : (
						<button className="button" onClick={handleClick}>
							Start
						</button>
					)}
					{authError ? (
						<Alert severity="error" className="error">
							Incorrect API ID or HASH ID, enter correct values.
						</Alert>
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
					<Box
						component="form"
						sx={{
							'& > :not(style)': { m: 1, width: '43ch' },
						}}
						noValidate
						autoComplete="off"
					>
						<TextField
							id="phone"
							label="PHONE"
							variant="standard"
							autoFocus={true}
							value={phoneData.phone}
							onChange={handleChange}
						/>
						<TextField
							id="code"
							label="CODE"
							variant="standard"
							value={phoneData.code}
							onChange={handleChange}
							className={phoneData.sended ? '' : 'hidden'}
						/>
					</Box>

					<button className="button" onClick={handleClick}>
						{phoneData.sended ? 'Confirm' : 'Send'}
					</button>
					{phoneError ? (
						<Alert severity="error" className="error">
							Phone number not exist, add correct phone.
						</Alert>
					) : (
						''
					)}
					{codeError ? (
						<Alert severity="error" className="error">
							Incorrect code, enter correct code.
						</Alert>
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
}

export default Login;
