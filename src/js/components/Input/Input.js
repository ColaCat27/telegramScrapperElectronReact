import React from 'react';
import './input.scss';

function Input({ label, placeholder }) {
	return (
		<div className="input">
			<label>{label}</label>
			<input type="text" placeholder={placeholder} />
		</div>
	);
}

export default Input;
