import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import ApiState from '../../../infrastructure/Enums/ApiState';
import { loadCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import { deleteCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/DeleteCustomer-Slice';
import { isFulfilled } from '@reduxjs/toolkit';
import { redirect, redirectDocument } from 'react-router-dom';

const CustomerList = () => {
    const dispatch = useAppDispatch();
    const stateCust = useAppSelector((state) => state.customers.state);
    const state = useAppSelector((state) => state.deleteCustomer.state);
    const customers = useAppSelector((state) => state.customers.data);
    const activeCustomer = useAppSelector((state) => state.customers.activeRequest);

    useEffect(() => {
        console.log("Loading...");
        console.log(state);
        dispatch(loadCustomers());
    }, [activeCustomer]);

    console.log(customers);



    const removeCustomer = (tckn: string) => {

        dispatch(deleteCustomers({ tckn }))
        if(state == ApiState.Fulfilled)
        {
            dispatch(loadCustomers());    
        }    
           
    };

    const updateCustomer = (tckn: string) => {


        redirectDocument()
        redirect(updateCustomer).formData(tckn)
        


    return (
        <div className="card">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">İsim</th>
                        <th scope="col">TCKN</th>
                        <th scope="col">Adres</th>
                        <th scope="col">Yaş</th>
                        <th scope="col">Cinsiyet</th>
                        <th scope="col">Email</th>
                        <th scope="col">Telefon</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <th scope="row">{customer.id}</th>
                            <td>{customer.name}</td>
                            <td>{customer.tckn}</td>
                            <td>{customer.address}</td>
                            <td>{customer.age}</td>
                            <td>{customer.gender}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>
                                {customer.id > 0 && (
                                    <button className='btn btn-danger' onClick={() => removeCustomer(customer.tckn) }>Sil</button>
                                )}
                            </td>
                            <td>
                                {customer.id > 0 && (
                                    <button className='btn btn-info' onClick={() => updateCustomer(customer.tckn) }>Güncelle</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerList;
