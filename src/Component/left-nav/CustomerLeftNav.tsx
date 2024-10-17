import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../infrastructure/Store/store';
import { loadCustomers, setActiveRequest } from '../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import ApiState from '../../infrastructure/Enums/ApiState';
import { NavLink } from 'react-router-dom';


const CustomerLeftNav = () => {

    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.customers.state);
    const customers = useAppSelector((state) => state.customers.data);
    const activeCustomer = useAppSelector((state) => state.customers.activeRequest);
    
    console.log('CategoryList is rendered: ', state);

    useEffect(() => {
        console.log(activeCustomer)
		
	}, [activeCustomer]);



  return (
    <div className="list-group">

<NavLink
    to="/customer"
    onClick={() => {
        dispatch(setActiveRequest(null));
    }}
    className={({ isActive }) =>
        
        `list-group-item list-group-item-action ${isActive && activeCustomer === null ? 'active' : ''}`
    }
>
    TÜM İŞLEMLER
</NavLink>

  <NavLink
    to="/customer/createCustomer"
    onClick={() => {
        dispatch(setActiveRequest(1));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCustomer === 1 ? 'active' : ''}`
    }
>
    MÜŞTERİ OLUŞTUR.
</NavLink>

<NavLink
    to="/customer/getCustomer"
    onClick={() => {
        dispatch(setActiveRequest(2));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCustomer === 2 ? 'active' : ''}`
    }
>
    MÜŞTERİ BUL
</NavLink>

<NavLink
    to="/customer/customerList"
    onClick={() => {
        dispatch(setActiveRequest(3));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCustomer === 3 ? 'active' : ''}`
    }
>
    TÜM MÜŞTERİLERİ LİSTELE
</NavLink>




  </div>

  )
}

export default CustomerLeftNav