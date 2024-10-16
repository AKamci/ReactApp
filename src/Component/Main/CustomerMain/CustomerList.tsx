import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { loadCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useNavigate } from 'react-router-dom';
import { CustomerDto } from '../../../infrastructure/dto/CustomerDto';
import { deleteCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/DeleteCustomer-Slice';
import { totalRecords } from '../../../infrastructure/Store/Slices/CustomerSlices/TotalRecordOfCustomer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';



const CustomerList = () => {
    const dispatch = useAppDispatch();
    const customers = useAppSelector((state) => state.customers.data);
    const state = useAppSelector((state) => state.deleteCustomer.state);

    const totalRecordState = useAppSelector((state) => state.totalRecord.state);
    const totalRecord = useAppSelector((state) => state.totalRecord.data);

    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(3); 
    const toast = useRef<Toast>(null);





    useEffect(() => {
        dispatch(totalRecords())
        dispatch(loadCustomers({ page: first / rows, size: rows })); 
    }, [first, rows]);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const removeCustomer = async (tckn: string) => {
        try {
            
            const resultAction = await dispatch(deleteCustomers({ tckn }));
            
            if (deleteCustomers.fulfilled.match(resultAction)) {
                
                dispatch(loadCustomers({ page: first / rows, size: rows }));
                
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
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.tckn}</td>
                            <td>{customer.address}</td>
                            <td>{customer.birthDay ? new Date(customer.birthDay).toLocaleDateString() : 'Tarih Yok'}</td>
                            <td>{customer.gender}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>
                                {customer.id > 0 && (
                                    <button className='btn btn-danger' onClick={() => removeCustomer(customer.tckn) }><FontAwesomeIcon icon={faTrash} /></button>
                                )}
                            </td>
                            <td>
                                {customer.id > 0 && (
                                    <button className='btn btn-info' onClick={() => updateCustomer(customer) }><FontAwesomeIcon icon={faPen} /></button>
                                )}
                            </td>
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
    );
};

export default CustomerList;
