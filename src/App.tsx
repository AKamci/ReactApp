import Routers from './infrastructure/Routers/Routers.tsx';
import './assets/app.css';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
	return (
		<>
			<Routers />
			<ToastContainer />
		</>
	);
};

export default React.memo(App);
