import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login/Login.js';
import Parser from './views/Parser/Parser.js';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Parser />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
