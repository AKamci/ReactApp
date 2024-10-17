import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/GetAllCarPolicy-Slice';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { deleteCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/DeleteCarPolicy-Slice';
import { totalRecordCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/TotalRecordOfCarPolicy-Slice';

const CarPolicyList = () => {
    const dispatch = useAppDispatch();
    const carPolicies = useAppSelector((state) => state.allCarPolicy.data);
    const totalRecord = useAppSelector((state) => state.totalRecordCarPolicy.data);

    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(3);
    const [selectedFilter, setSelectedFilter] = useState<string>(''); 
    const [policyNameFilter, setPolicyNameFilter] = useState<string>(''); 
    const [policyTypeFilter, setPolicyTypeFilter] = useState<string>(''); 
    const [policyDateStart, setPolicyDateStart] = useState<string>(''); 
    const [policyDateEnd, setPolicyDateEnd] = useState<string>(''); 

    const toast = useRef<Toast>(null);

    useEffect(() => {
        dispatch(totalRecordCarPolicy());
        dispatch(getAllCarPolicy({ 
            page: first / rows, 
            size: rows, 
            policyName: policyNameFilter, 
            policyType: policyTypeFilter, 
            policyDateStart: policyDateStart, 
            policyDateEnd: policyDateEnd 
        }));

        console.log(totalRecord)
    }, [first, rows, policyNameFilter, policyTypeFilter, policyDateStart, policyDateEnd]);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleFilterChange = () => {
        setFirst(0); 
        dispatch(getAllCarPolicy({ 
            page: 0, 
            size: rows, 
            policyName: policyNameFilter, 
            policyType: policyTypeFilter, 
            policyDateStart: policyDateStart, 
            policyDateEnd: policyDateEnd 
        }));
    };

    const clearFilters = () => {
        setPolicyNameFilter('');
        setPolicyTypeFilter('');
        setPolicyDateStart('');
        setPolicyDateEnd('');
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
                    <option value="policyName">Poliçe İsmine Göre</option>
                    <option value="policyType">Poliçe Türüne Göre</option>
                    <option value="policyDate">Poliçe Tarihine Göre</option>
                </select>
            </div>

            {selectedFilter === 'policyName' && (
                <input 
                    type="text" 
                    placeholder="Poliçe İsmine Göre Filtrele" 
                    value={policyNameFilter} 
                    onChange={(e) => setPolicyNameFilter(e.target.value)} 
                    className="form-control mb-3"
                />
            )}
            {selectedFilter === 'policyType' && (
                <input 
                    type="text" 
                    placeholder="Poliçe Türüne Göre Filtrele" 
                    value={policyTypeFilter} 
                    onChange={(e) => setPolicyTypeFilter(e.target.value)} 
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
                <button onClick={handleFilterChange} className="btn btn-primary col-2">Filtrele</button>
                <button onClick={clearFilters} className="btn btn-secondary col-2">Temizle</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Poliçe No</th>
                        <th scope="col">Poliçe İsmi</th>
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
                    {carPolicies.map((carPolicy) => (
                        <tr key={carPolicy.id}>
                            <td>{carPolicy.id}</td>
                            <td>{carPolicy.policyName}</td>
                            <td>{carPolicy.policyDescription}</td>
                            <td>{carPolicy.policyType}</td>
                            <td>{carPolicy.policyStatus ? 'Aktif' : 'Pasif'}</td>
                            <td>{carPolicy.policyAmount}</td>
                            <td>{carPolicy.policyStartDate ? new Date(carPolicy.policyStartDate).toLocaleDateString() : 'Tarih Yok'}</td>
                            <td>{carPolicy.policyEndDate ? new Date(carPolicy.policyEndDate).toLocaleDateString() : 'Tarih Yok'}</td>
                            <td>{carPolicy.tckn}</td>
                            <td>{carPolicy.licensePlateNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginator          
                first={first}
                rows={rows}
                totalRecords={totalRecord} 
                rowsPerPageOptions={[3, 10, 20, 50, 100]}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default CarPolicyList;
