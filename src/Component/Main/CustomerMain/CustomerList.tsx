import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import ApiState from '../../../infrastructure/Enums/ApiState';
import { loadCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import { deleteCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/DeleteCustomer-Slice';
import { isFulfilled } from '@reduxjs/toolkit';
import { redirect, redirectDocument, useNavigate } from 'react-router-dom';
import { CustomerDto } from '../../../infrastructure/dto/CustomerDto';
import { Toast } from 'primereact/toast';

const CustomerList = () => {
    const dispatch = useAppDispatch();
    const stateCust = useAppSelector((state) => state.customers.state);
    const state = useAppSelector((state) => state.deleteCustomer.state);
    const customers = useAppSelector((state) => state.customers.data);
    const activeCustomer = useAppSelector((state) => state.customers.activeRequest);
    const toast = useRef<Toast>(null);


    useEffect(() => {
        console.log("Loading...");
        console.log(state);
        dispatch(loadCustomers());
    }, [activeCustomer]);

    console.log(customers);



    const removeCustomer = async (tckn: string) => {
        try {
            
            const resultAction = await dispatch(deleteCustomers({ tckn }));
            
            if (deleteCustomers.fulfilled.match(resultAction)) {
                
                dispatch(loadCustomers());
                
                toast.current?.show({ 
                    severity: 'info', 
                    summary: 'Başarılı', 
                    detail: 'Müşteri Başarıyla Silindi.', 
                    life: 2000 
                });
            } else {
                
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Hata', 
                    detail: 'Müşteri silinemedi.', 
                    life: 2000 
                });
            }
        } catch (error) {
            console.error('Silme işlemi sırasında bir hata oluştu:', error);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Hata', 
                detail: 'Bir hata oluştu, lütfen tekrar deneyin.', 
                life: 2000 
            });
        }
    };
    

    const navigate = useNavigate();
    const updateCustomer = (customer: CustomerDto) => {
        
        const customerData = {
            customer
        };
   
        navigate('/customer/updateCustomer', { state: { customer: customerData } });


    };



    return (
        
        <div className="card">
            <Toast ref={toast} />
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">İsim</th>
                        <th scope="col">TCKN</th>
                        <th scope="col">Adres</th>
                        <th scope="col">Doğum Tarihi</th>
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
                            <td>{customer.birthDay ? new Date(customer.birthDay).toLocaleDateString() : 'Tarih Yok'}</td>
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
                                    <button className='btn btn-info' onClick={() => updateCustomer(customer) }>Güncelle</button>
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
