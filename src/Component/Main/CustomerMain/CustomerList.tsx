import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { loadCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { totalRecords } from '../../../infrastructure/Store/Slices/CustomerSlices/TotalRecordOfCustomer';
import Spinner from '../../Shared/Spinner';
import ApiState from '../../../infrastructure/Enums/ApiState';

const CustomerList = () => {
    const dispatch = useAppDispatch();
    const customers = useAppSelector((state) => state.customers.data);
    const totalRecord = useAppSelector((state) => state.totalRecord.data);
    const state = useAppSelector((state) => state.customers.state);

    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(3);
    const [selectedFilter, setSelectedFilter] = useState<string>('');
    const [nameFilter, setNameFilter] = useState<string>(''); 
    const [tcknFilter, setTcknFilter] = useState<string>(''); 
    const [birthDateStart, setBirthDateStart] = useState<string>(''); 
    const [birthDateEnd, setBirthDateEnd] = useState<string>(''); 
    const toast = useRef<Toast>(null);

    useEffect(() => {
        dispatch(totalRecords());
    }, [dispatch, totalRecord]);

    useEffect(() => {
        if (!nameFilter && !tcknFilter && !birthDateStart && !birthDateEnd) {
            dispatch(loadCustomers({ 
                page: first / rows, 
                size: rows 
            }));
            console.log(customers)

        }
    }, [first, rows, dispatch, nameFilter, tcknFilter, birthDateStart, birthDateEnd]);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleFilterChange = () => {
        setFirst(0); 
        dispatch(loadCustomers({ 
            page: 0, 
            size: rows, 
            name: nameFilter, 
            tckn: tcknFilter, 
            birthDateStart: birthDateStart, 
            birthDateEnd: birthDateEnd 
        }));
    };

    return (
        <div className="">
            <Toast ref={toast} />
    
            {(state === ApiState.Pending || state === ApiState.Rejected) ? (
                <Spinner color='primary' />
            ) : (
                <div>
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
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.tckn}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.birthDay ? new Date(customer.birthDay).toLocaleDateString() : 'Tarih Yok'}</td>
                                    <td>
                                        {customer.gender === 1 ? 'Erkek' : customer.gender === 0 ? 'Kadın' : ''}
                                    </td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
    
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={totalRecord}
                        rowsPerPageOptions={[3, 10, 20, 50]}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomerList;
