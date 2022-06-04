import React from 'react';
import './login.scss';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

function Login() {
	return (
		<div className="login">
			<div className="wrapper">
				<Input label="API ID" placeholder="214512" />
				<Input label="API HASH" placeholder="1t1tg43g3yyghHT534TF" />
				<Button text="Next" />
			</div>
		</div>
	);
}

export default Login;
