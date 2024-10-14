import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../../Component/Pages/HomePage';

import React from 'react';
import CustomerPage from '../../Component/Pages/CustomerPage';
import CarPolicyPage from '../../Component/Pages/CarPolicyPage';
import UpdateCustomerPage from '../../Component/Pages/CustomerPages/UpdateCustomerPage';
import CreateCustomerPage from '../../Component/Pages/CustomerPages/CreateCustomerPage';
import CustomerListPage from '../../Component/Pages/CustomerPages/CustomerListPage';
import GetCustomerPage from '../../Component/Pages/CustomerPages/GetCustomerPage';


const Routers = () => {
	console.log('Routers is rendered.');
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/customer' element={<CustomerPage />} />
				<Route path='/carPolicy' element={<CarPolicyPage />} />
				<Route path='/carPolicy' element={<CarPolicyPage />} />
				<Route path='/customer/createCustomer' element={<CreateCustomerPage />} />
				<Route path='/customer/updateCustomer' element={<UpdateCustomerPage />} />
				<Route path='/customer/customerList' element={<CustomerListPage />} />
				<Route path='/customer/getCustomer' element={<GetCustomerPage />} />


			</Routes>
		</BrowserRouter>
	);
};

export default React.memo(Routers);
