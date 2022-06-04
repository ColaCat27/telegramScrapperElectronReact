import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login/Login.js';
import Home from './views/Home/Home.js';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
