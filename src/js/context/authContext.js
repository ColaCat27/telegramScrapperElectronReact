import React, { createContext, useEffect, useReducer } from 'react';

const INITIAL_STATE = {
	apiData: JSON.parse(localStorage.getItem('apiData')) || null,
	loading: false,
	error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			return {
				apiData: action.payload,
				loading: false,
				error: null,
			};
		case 'LOGIN_FAILURE':
			return {
				apiData: null,
				loading: false,
				error: action.payload,
			};
		case 'LOGOUT':
			return {
				apiData: null,
				loading: false,
				error: null,
			};
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

	useEffect(() => {
		localStorage.setItem('apiData', JSON.stringify(state.apiData));
	}, [state.apiData]);

	return (
		<AuthContext.Provider
			value={{
				apiData: state.apiData,
				loading: state.loading,
				error: state.error,
				dispatch,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
