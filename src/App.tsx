import Routers from './infrastructure/Routers/Routers.tsx';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema için
import 'primereact/resources/primereact.min.css';  // PrimeReact bileşenleri için
import 'primeicons/primeicons.css';  // İkonlar için
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
