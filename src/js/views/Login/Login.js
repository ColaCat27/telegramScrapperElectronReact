import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import './login.scss';

function Login() {
	const [credentials, setCredentials] = useState({
		apiData: undefined,
	});

	const { loading, error, dispatch } = useContext(AuthContext);

	const navigate = useNavigate();
	const handleClick = (e) => {
		e.preventDefault();

		dispatch({
			type: 'LOGIN_SUCESS',
			payload: JSON.stringify(credentials),
		});

		navigate('/');
	};

	const handleChange = (e) => {
		setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
		console.log(credentials);
	};

	return (
		<div className="login">
			<div className="wrapper">
				{error}
				<div className="input">
					<label>API ID</label>
					<input
						type="text"
						placeholder="214512"
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
					Next
				</button>
			</div>
		</div>
	);
}

export default Login;
