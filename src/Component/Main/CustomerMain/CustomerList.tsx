import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { loadCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { totalRecords } from '../../../infrastructure/Store/Slices/CustomerSlices/TotalRecordOfCustomer';

const CustomerList = () => {
    const dispatch = useAppDispatch();
    const customers = useAppSelector((state) => state.customers.data);
    const totalRecord = useAppSelector((state) => state.totalRecord.data);

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

    const clearFilters = () => {
        setNameFilter('');
        setTcknFilter('');
        setBirthDateStart('');
        setBirthDateEnd('');
        handleFilterChange(); 
    };

    const handleFilterSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilter(e.target.value);
    };

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="filter-selection mb-4">
                <select value={selectedFilter} onChange={handleFilterSelection} className="form-control">
                    <option value="">Filtre Seçiniz</option>
                    <option value="name">İsme Göre</option>
                    <option value="tckn">TCKN'ye Göre</option>
                    <option value="birthDate">Doğum Tarihi Aralığına Göre</option>
                </select>
            </div>

            {selectedFilter === 'name' && (
                <input 
                    type="text" 
                    placeholder="İsme Göre Filtrele" 
                    value={nameFilter} 
                    onChange={(e) => setNameFilter(e.target.value)} 
                    className="form-control mb-3"
                />
            )}
            {selectedFilter === 'tckn' && (
                <input 
                    type="text" 
                    placeholder="TCKN'ye Göre Filtrele" 
                    value={tcknFilter} 
                    onChange={(e) => setTcknFilter(e.target.value)} 
                    className="form-control mb-3"
                />
            )}
            {selectedFilter === 'birthDate' && (
                <>
                    <input 
                        type="date" 
                        placeholder="Doğum Tarihi Başlangıç" 
                        value={birthDateStart} 
                        onChange={(e) => setBirthDateStart(e.target.value)} 
                        className="form-control mb-3"
                    />
                    <input 
                        type="date" 
                        placeholder="Doğum Tarihi Bitiş" 
                        value={birthDateEnd} 
                        onChange={(e) => setBirthDateEnd(e.target.value)} 
                        className="form-control mb-3"
                    />
                </>
            )}
            <div>
                <button onClick={handleFilterChange} className="btn btn-primary col-2">Filtrele</button>
                <button onClick={clearFilters} className="btn btn-secondary col-2">Temizle</button>
            </div>

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
                            <td>{customer.gender}</td>
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
    );
};

export default CustomerList;
