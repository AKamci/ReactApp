import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/GetAllCarPolicy-Slice';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { totalRecordCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/TotalRecordOfCarPolicy-Slice';
import Spinner from '../../Shared/Spinner';
import ApiState from '../../../infrastructure/Enums/ApiState';

const CarPolicyList = () => {
    const dispatch = useAppDispatch();
    const carPolicies = useAppSelector((state) => state.allCarPolicy.data);
    const state = useAppSelector((state) => state.allCarPolicy.state);

    const totalRecord = useAppSelector((state) => state.totalRecordCarPolicy.data);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(3);
    const [selectedFilter, setSelectedFilter] = useState<string>(''); 
    const [policyNameFilter, setPolicyNameFilter] = useState<string>(''); 
    const [policyDateStart, setPolicyDateStart] = useState<string>(''); 
    const [policyDateEnd, setPolicyDateEnd] = useState<string>(''); 

    const [filterCounter, setFilterCounter] = useState(0);
    const [policyTypeFilter, setPolicyTypeFilter] = useState<string>(''); 
    const [customerTCKN, setCustomerTCKN] = useState<string>('');
    const [carPlate, setCarPlate] = useState<string>(''); 
    const [policyStatus, setPolicyStatus] = useState<boolean | null>(null);
    const toast = useRef<Toast>(null);
    const [filtersCleared, setFiltersCleared] = useState<boolean>(false); // New state to track clearing filters


    useEffect(() => {
        dispatch(totalRecordCarPolicy());
        dispatch(getAllCarPolicy({ 
            page: first / rows, 
            size: rows,
            policyStatus: policyStatus,
            tckn: customerTCKN ? customerTCKN : null,
            policyType: policyTypeFilter ? policyTypeFilter : null, 
            licensePlateNumber: carPlate ? carPlate : null, 
            policyStartDate: policyDateStart ? policyDateStart.toISOString().split('T')[0] : null, 
            policyEndDate: policyDateEnd ? policyDateEnd.toISOString().split('T')[0] : null
        }));
        console.log(totalRecord);
        console.log("CAR POLICIES");
        console.log(carPolicies);
    }, [first, rows, filtersCleared]);


    const validateTCKN = (customerTCKN: string) => {
        const tcknRegex = /^[0-9]{11}$/;
        return tcknRegex.test(customerTCKN);
    };
    
    const validateCarPlate = (carPlate: string) => {
        const plateRegex = /^(0[1-9]|[1-7][0-9]|80|81)[A-Z]{1,4}[0-9]{4}$/;
        return plateRegex.test(carPlate);
    };

    const handleApplyFilter = () => {
        if (selectedFilter === 'customerTckn' && !validateTCKN(customerTCKN)) {
            toast.current.show({ severity: 'error', summary: 'Hata', detail: 'TCKN 11 haneli ve sadece rakamlardan oluşmalıdır!', life: 3000 });
            return;
        }
        
        if (selectedFilter === 'carPlate' && !validateCarPlate(carPlate)) {
            toast.current.show({ severity: 'error', summary: 'Hata', detail: 'Araç plakası geçerli bir formatta olmalıdır!', life: 3000 });
            return;
        }
    
        const filters = [];
        if (policyStatus !== null) filters.push(`Durum: ${policyStatus ? 'Aktif' : 'Pasif'}`);
        if (policyTypeFilter) filters.push(`Tür: ${policyTypeFilter}`);
        if (customerTCKN) filters.push(`TCKN: ${customerTCKN}`);
        if (carPlate) filters.push(`Plaka: ${carPlate}`);
        if (policyDateStart && policyDateEnd) filters.push(`Tarih Aralığı: ${policyDateStart} - ${policyDateEnd}`);
        setActiveFilters(filters);


        handleFilterChange();
    };


    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleFilterChange = async () => {
        await dispatch(totalRecordCarPolicy());
        setFirst(0); 
        await dispatch(getAllCarPolicy({ 
            page: 0, 
            size: rows, 
            policyStatus: policyStatus,
            tckn: customerTCKN,
            policyType: policyTypeFilter, 
            licensePlateNumber: carPlate, 
            policyStartDate: policyDateStart, 
            policyEndDate: policyDateEnd,
        }));
        await dispatch(totalRecordCarPolicy());
        console.log(totalRecord)
        console.log("handleFilterChange :")
        console.log(policyStatus, policyTypeFilter, carPlate, customerTCKN, policyDateStart, policyDateEnd)
        console.log(carPolicies)
    };

    const clearFilters = async () => {
        setPolicyNameFilter('');
        setPolicyTypeFilter('');
        setPolicyDateStart('');
        setPolicyDateEnd('');
        setCarPlate('');
        setCustomerTCKN('');
        setPolicyStatus(null);
        setActiveFilters([]);
        

        const newCounter = filterCounter + 1;
        setFilterCounter(newCounter);

        if (newCounter % 2 === 1) {
            alert("Filtre Temizlendi --> Tüm Müşteriler için tekrar temizleye tıklayınız.");
        }
        await handleFilterChange();
    };

    const handleFilterSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilter(e.target.value);
    };



    return (
        <div className="">
            <Toast ref={toast} />
    
            {(state === ApiState.Pending || state === ApiState.Rejected) ? (
                <Spinner color='primary' />
            ) : (
                <>
                {activeFilters.length > 0 && (
                    <div className="mb-3">
                        <strong>Uygulanan Filtreler:</strong> {activeFilters.join(', ')}
                    </div>
                )}
                    <div className="filter-selection mb-4">
                        <select value={selectedFilter} onChange={handleFilterSelection} className="form-control">
                            <option value="">Filtre Seçiniz</option>
                            <option value="policyStatus">Poliçe Durumuna Göre</option>
                            <option value="policyType">Poliçe Türüne Göre</option>
                            <option value="customerTckn">Müşteri TCKN'a Göre</option>
                            <option value="carPlate">Araç Plakasına Göre</option>
                            <option value="policyDate">Aktif Tarihe Göre</option>
                        </select>
                    </div>
    
                    {selectedFilter === 'policyStatus' && (
                        <select
                            value={policyStatus !== null ? policyStatus.toString() : ''}
                            onChange={(e) => setPolicyStatus(e.target.value === 'true')}
                            className="form-control mb-3"
                        >
                            <option value=''>Poliçe Durumunu Seçin</option>
                            <option value="true">Aktif</option>
                            <option value="false">Pasif</option>
                        </select>
                    )}
    
                    {selectedFilter === 'policyType' && (
                        <select
                            value={policyTypeFilter}
                            onChange={(e) => setPolicyTypeFilter(e.target.value)}
                            className="form-control mb-3"
                        >
                            <option value=''>Poliçe Türünü Seçin</option>
                            <option value="Kasko">Kasko</option>
                            <option value="Trafik">Trafik</option>
                        </select>
                    )}
    
                    {selectedFilter === 'customerTckn' && (
                        <input
                            type="text"
                            placeholder="Poliçe TCKN'ye Göre Filtrele"
                            value={customerTCKN}
                            onChange={(e) => setCustomerTCKN(e.target.value)}
                            className="form-control mb-3"
                        />
                    )}
    
                    {selectedFilter === 'carPlate' && (
                        <input
                            type="text"
                            placeholder="Plakaya Göre Filtrele"
                            value={carPlate}
                            onChange={(e) => setCarPlate(e.target.value)}
                            className="form-control mb-3"
                        />
                    )}
    
                    {selectedFilter === 'policyDate' && (
                        <>
                            <input
                                type="date"
                                placeholder="Poliçe Başlangıç Tarihi"
                                value={policyDateStart}
                                onChange={(e) => setPolicyDateStart(e.target.value)}
                                className="form-control mb-3"
                            />
                            <input
                                type="date"
                                placeholder="Poliçe Bitiş Tarihi"
                                value={policyDateEnd}
                                onChange={(e) => setPolicyDateEnd(e.target.value)}
                                className="form-control mb-3"
                            />
                        </>
                    )}
    
                    <div>
                        <button onClick={handleApplyFilter} className="btn btn-primary col-2">Filtrele</button>
                        <button onClick={clearFilters} className="btn btn-secondary col-2">Temizle</button>
                    </div>
    
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Poliçe No</th>
                                <th scope="col">Açıklama</th>
                                <th scope="col">Tür</th>
                                <th scope="col">Durum</th>
                                <th scope="col">Tutar</th>
                                <th scope="col">Başlangıç Tarihi</th>
                                <th scope="col">Bitiş Tarihi</th>
                                <th scope="col">Müşteri TCKN</th>
                                <th scope="col">Plaka</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carPolicies.length > 0 ? (
                                carPolicies.map((carPolicy) => (
                                    <tr key={carPolicy.policyId}>
                                        <td>{carPolicy.policyId}</td>
                                        <td>{carPolicy.policyDescription}</td>
                                        <td>{carPolicy.policyType}</td>
                                        <td>{carPolicy.policyStatus ? 'Aktif' : 'Pasif'}</td>
                                        <td>{carPolicy.policyAmount}</td>
                                        <td>{carPolicy.policyStartDate ? new Date(carPolicy.policyStartDate).toLocaleDateString() : 'Tarih Yok'}</td>
                                        <td>{carPolicy.policyEndDate ? new Date(carPolicy.policyEndDate).toLocaleDateString() : 'Tarih Yok'}</td>
                                        <td>{carPolicy.tckn}</td>
                                        <td>{carPolicy.licensePlateNumber}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center">Veri Bulunamadı</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
    
                    <Paginator          
                        first={first}
                        rows={rows}
                        totalRecords={totalRecord} 
                        rowsPerPageOptions={[3, 10, 20, 50, 100]}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </div>
    );
    
};

export default CarPolicyList;
