import React, { useState } from 'react';
import './navbar.scss';

function Navbar() {
	const [state, setState] = useState(false);

	const handleMenu = () => {
		setState(!state);
	};

	return (
		<div className="navbar">
			<div className="left">
				<img
					src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
					className="logo"
				/>
				<ul className="list">
					<li className="list__item list__item_active">Parser</li>
					<li className="list__item">Sender</li>
					<li className="list__item">Logs</li>
					<li className="list__item">Donate</li>
				</ul>
			</div>
			<div className="right">
				<div className="notifications">
					<button type="button">
						<svg
							class="h-6 w-6"
							x-description="Heroicon name: outline/bell"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							></path>
						</svg>
					</button>
				</div>
				<div className="user" onClick={handleMenu}>
					<ul
						className="user__menu"
						style={{
							display: state ? 'block' : '',
						}}
					>
						<li className="user__menu-item">Profile Data</li>
						<li className="user__menu-item">Change API Data</li>
					</ul>
					<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
