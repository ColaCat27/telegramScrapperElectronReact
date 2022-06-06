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

	const [confirm, setConfirm] = useState({
		phone: undefined,
		code: undefined,
		sended: false,
	});

	const { loading, error, dispatch } = useContext(AuthContext);

	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();

		if (!confirm.sended) {
			ipcRenderer.send('login', credentials);
			setCredentials({ id: undefined, hash: undefined });
			setConfirm((prev) => ({ ...prev, sended: true }));
			console.log(confirm);
		}
		// dispatch({
		// 	type: 'LOGIN_SUCESS',
		// 	payload: JSON.stringify(credentials),
		// });

		// navigate('/');
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
				{error}
				<div className="input">
					<label>{confirm.sended ? 'PHONE' : 'API ID'}</label>
					<input
						type="text"
						placeholder={
							confirm.sended ? '+380508167897' : '214512'
						}
						id={confirm.sended ? 'phone' : 'id'}
						onChange={handleChange}
						value={confirm.sended ? confirm.phone : credentials.id}
					/>
				</div>
				<div className="input">
					<label>{confirm.sended ? 'CODE' : 'API HASH'}</label>
					<input
						type="text"
						placeholder={
							confirm.sended ? '12345' : '1t1tg43g3yyghHT534TF'
						}
						id={confirm.sended ? 'code' : 'hash'}
						onChange={handleChange}
						value={confirm.sended ? confirm.code : credentials.hash}
					/>
				</div>
				<button className="button" onClick={handleClick}>
					{confirm.sended ? 'Confirm' : 'Start'}
				</button>
			</div>
		</div>
	);
}

export default Login;
