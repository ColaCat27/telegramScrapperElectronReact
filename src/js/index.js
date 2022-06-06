import React from 'react';
import ReactDom from 'react-dom';

import App from './App';
import { AuthContextProvider } from './context/authContext';

ReactDom.render(
	<AuthContextProvider>
		<App />
	</AuthContextProvider>,

	document.getElementById('root')
);
