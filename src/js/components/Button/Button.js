import React from 'react';
import '../Button/button.scss';

function Button({ text }) {
	return (
		<div>
			<button className="button">{text}</button>
		</div>
	);
}

export default Button;
