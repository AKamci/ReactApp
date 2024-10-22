import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../infrastructure/Store/store';
import { setActiveRequest } from '../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import { NavLink } from 'react-router-dom';

const CustomerLeftNav = () => {
	return (
		<>
			<div className='list-group'>
				<NavLink
					to='/customer'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					TÜM İŞLEMLER
				</NavLink>

				<NavLink
					to='/customer/createCustomer'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					MÜŞTERİ OLUŞTUR
				</NavLink>

				<NavLink
					to='/customer/getCustomer'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					MÜŞTERİ BUL
				</NavLink>

				<NavLink
					to='/customer/customerList'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive  ? 'active' : ''}`
					}>
					TÜM MÜŞTERİLERİ LİSTELE
				</NavLink>
			</div>
		</>
	);
};
export default CustomerLeftNav;
