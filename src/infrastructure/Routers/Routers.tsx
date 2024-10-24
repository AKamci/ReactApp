import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../../Component/Pages/HomePage';

import React from 'react';
import CustomerPage from '../../Component/Pages/CustomerPage';
import CarPolicyPage from '../../Component/Pages/CarPolicyPage';
import UpdateCustomerPage from '../../Component/Pages/CustomerPages/UpdateCustomerPage';
import CreateCustomerPage from '../../Component/Pages/CustomerPages/CreateCustomerPage';
import CustomerListPage from '../../Component/Pages/CustomerPages/CustomerListPage';
import GetCustomerPage from '../../Component/Pages/CustomerPages/GetCustomerPage';
import CarPolicyListPage from '../../Component/Pages/CarPolicyPages/CarPolicyListPage';
import GetCarPolicyPage from '../../Component/Pages/CarPolicyPages/GetCarPolicyPage';
import CreateCarPolicyPage from '../../Component/Pages/CarPolicyPages/CreateCarPolicyPage';
import UpdateCarPolicyPage from '../../Component/Pages/CarPolicyPages/UpdateCarPolicyPage';


const Routers = () => {
	console.log('Routers is rendered.');
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/customer' element={<CustomerPage />} />
				<Route path='/customer/createCustomer' element={<CreateCustomerPage />} />
				<Route path='/customer/updateCustomer' element={<UpdateCustomerPage />} />
				<Route path='/customer/customerList' element={<CustomerListPage />} />
				<Route path='/customer/getCustomer' element={<GetCustomerPage />} />
				<Route path='/carPolicy' element={<CarPolicyPage />} />
				<Route path='/carPolicy/createCarPolicy' element={<CreateCarPolicyPage />} />
				<Route path='/carPolicy/getCarPolicy' element={<GetCarPolicyPage />} />
				<Route path='/carPolicy/list' element={<CarPolicyListPage />} />
				<Route path='/carPolicy/updateCarPolicy' element={<UpdateCarPolicyPage />} />
				

				
			</Routes>
		</BrowserRouter>
	);
};

export default React.memo(Routers);
