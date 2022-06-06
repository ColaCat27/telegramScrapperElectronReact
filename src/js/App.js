import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/authContext.js';
import Login from './views/Login/Login.js';
import Parser from './views/Parser/Parser.js';

function App() {
	const ProtectedRoute = ({ children }) => {
		const { apiData } = useContext(AuthContext);

		if (!apiData) {
			return <Navigate to="/login" />;
		}
		return children;
	};

	return (
		<div className="App">
			<HashRouter>
				<Routes>
					<Route path="/">
						<Route path="login" element={<Login />} />
						<Route
							index
							element={
								<ProtectedRoute>
									<Parser />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</HashRouter>
		</div>
	);
}

export default App;
