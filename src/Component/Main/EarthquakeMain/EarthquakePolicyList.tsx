import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllEarthquakePolicy } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/GetAllEarhquakePolicy-Slice';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { totalRecordEarthquakePolicy } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/TotalRecordOfEarhquakePolicy';
import Spinner from '../../Shared/Spinner';
import ApiState from '../../../infrastructure/Enums/ApiState';
import EarthquakePolicyState from '../../../infrastructure/Enums/CarPolicyStateEnum';
import AddressData from '../../../infrastructure/Helpers/AddressData';

const EarthquakePolicyList = () => {
  const dispatch = useAppDispatch();
  const earthquakePolicies = useAppSelector((state) => state.allEarthquakePolicy.data);
  const state = useAppSelector((state) => state.allEarthquakePolicy.state);

  const totalRecord = useAppSelector((state) => state.totalRecordEarthquakePolicy.data);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [selectedFilter, setSelectedFilter] = useState<string>(''); 
  const [policyNameFilter, setPolicyNameFilter] = useState<string>(''); 
  const [policyDateStart, setPolicyDateStart] = useState<string>(''); 
  const [policyDateEnd, setPolicyDateEnd] = useState<string>(''); 

  const [filterCounter, setFilterCounter] = useState(0);
  const [policyTypeFilter, setPolicyTypeFilter] = useState<number | null>(null); 
  const [customerTCKN, setCustomerTCKN] = useState<string>('');
  const [carPlate, setCarPlate] = useState<string>(''); 
  const [policyStatus, setPolicyStatus] = useState<EarthquakePolicyState | null>(null);
  const [integerNumber, setIntegerNumber] = useState<number | null>(null);
  const [apartmentNumber, setApartmentNumber] = useState<number | null>(null);
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const toast = useRef<Toast>(null);
  const [filtersCleared, setFiltersCleared] = useState<boolean>(false);

  useEffect(() => {
      dispatch(totalRecordEarthquakePolicy());
      dispatch(getAllEarthquakePolicy({ 
          page: first / rows, 
          size: rows,
          state: policyStatus,
          tckn: customerTCKN || undefined,
          coverageCode: policyTypeFilter || undefined, 
          licensePlateNumber: carPlate || undefined, 
          policyStartDate: policyDateStart || undefined, 
          policyEndDate: policyDateEnd || undefined,
          integerNumber: integerNumber || undefined,
          apartmentNumber: apartmentNumber || undefined,
          city: city || undefined,
          district: district || undefined,
          neighborhood: neighborhood || undefined
      }));
      console.log(totalRecord);
      console.log("EARTHQUAKE POLICIES");
      console.log(earthquakePolicies);
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
          toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'TCKN 11 haneli ve sadece rakamlardan oluşmalıdır!', life: 3000 });
          return;
      }
      
      if (selectedFilter === 'carPlate' && !validateCarPlate(carPlate)) {
          toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Araç plakası geçerli bir formatta olmalıdır!', life: 3000 });
          return;
      }
  
      const filters = [];
      if (policyStatus !== null) filters.push(`Durum: ${policyStatus}`);
      if (policyTypeFilter !== null) {
          if (policyTypeFilter === 103) {
              filters.push("Tür: YARI_KAPSAMLI");
          } else if (policyTypeFilter === 104) {
              filters.push("Tür: TAM_KAPSAMLI");
          } else {
              filters.push(`Tür: ${policyTypeFilter}`);
          }
      }
      
      if (customerTCKN) filters.push(`TCKN: ${customerTCKN}`);
      if (policyDateStart && policyDateEnd) filters.push(`Tarih Aralığı: ${policyDateStart} - ${policyDateEnd}`);
      if (integerNumber !== null) filters.push(`Bina No: ${integerNumber}`);
      if (apartmentNumber !== null) filters.push(`Daire No: ${apartmentNumber}`);
      if (city) filters.push(`Şehir: ${city}`);
      if (district) filters.push(`İlçe: ${district}`);
      if (neighborhood) filters.push(`Mahalle: ${neighborhood}`);
      setActiveFilters(filters);

      handleFilterChange();
  };

  const onPageChange = (event: PaginatorPageChangeEvent) => {
      setFirst(event.first);
      setRows(event.rows);
  };

  const handleFilterChange = async () => {
      await dispatch(totalRecordEarthquakePolicy());
      setFirst(0); 
      await dispatch(getAllEarthquakePolicy({ 
          page: 0, 
          size: rows, 
          state: policyStatus,
          tckn: customerTCKN,
          coverage: policyTypeFilter, 
          licensePlateNumber: carPlate, 
          policyStartDate: policyDateStart, 
          policyEndDate: policyDateEnd,
          integerNumber: integerNumber,
          apartmentNumber: apartmentNumber,
          city: city,
          district: district,
          neighborhood: neighborhood
      }));
      await dispatch(totalRecordEarthquakePolicy());
      console.log(totalRecord)
      console.log("handleFilterChange :")
      console.log(policyStatus, policyTypeFilter, carPlate, customerTCKN, policyDateStart, policyDateEnd, integerNumber, apartmentNumber, city, district, neighborhood)
      console.log(earthquakePolicies)
  };

  const clearFilters = async () => {
      setPolicyNameFilter('');
      setPolicyTypeFilter(null);
      setPolicyDateStart('');
      setPolicyDateEnd('');
      setCarPlate('');
      setCustomerTCKN('');
      setPolicyStatus(null);
      setIntegerNumber(null);
      setApartmentNumber(null);
      setCity('');
      setDistrict('');
      setNeighborhood('');
      setActiveFilters([]);
      setSelectedFilter(''); // Filtre Seçiniz olarak ayarla
      
      await dispatch(getAllEarthquakePolicy({ page: 0, size: rows }));
      setFiltersCleared(true);
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
                          <option value="address">Adres Bilgilerine Göre</option>
                      </select>
                  </div>
  
                  {selectedFilter === 'policyStatus' && (
                  <select
                      value={policyStatus || ''}
                      onChange={(e) => setPolicyStatus(e.target.value as EarthquakePolicyState)}
                      className="form-control mb-3"
                  >
                      <option value=''>Poliçe Durumunu Seçin</option>
                      {Object.values(EarthquakePolicyState).map((status) => (
                          <option key={status} value={status}>
                              {status}
                          </option>
                      ))}
                  </select>
              )}
  
                      {selectedFilter === 'policyType' && (
                      <select
                          value={policyTypeFilter !== null ? policyTypeFilter.toString() : ''}
                          onChange={(e) => setPolicyTypeFilter(e.target.value ? Number(e.target.value) : null)}
                          className="form-control mb-3"
                      >
                          <option value=''>Poliçe Türünü Seçin</option>
                          <option value="103">YARI_KAPSAMLI</option>
                          <option value="104">TAM_KAPSAMLI</option>
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
  
                  {selectedFilter === 'address' && (
                      <>
                          <input
                              type="number"
                              placeholder="Bina Numarasına Göre Filtrele"
                              value={integerNumber !== null ? integerNumber.toString() : ''}
                              onChange={(e) => setIntegerNumber(e.target.value ? Number(e.target.value) : null)}
                              className="form-control mb-3"
                          />
                          <input
                              type="number"
                              placeholder="Daire Numarasına Göre Filtrele"
                              value={apartmentNumber !== null ? apartmentNumber.toString() : ''}
                              onChange={(e) => setApartmentNumber(e.target.value ? Number(e.target.value) : null)}
                              className="form-control mb-3"
                          />
                          <select
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="form-control mb-3"
                          >
                              <option value="">Şehir Seçin</option>
                              {Object.keys(AddressData.Türkiye).map((city) => (
                                  <option key={city} value={city}>
                                      {city}
                                  </option>
                              ))}
                          </select>
                          <select
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              className="form-control mb-3"
                          >
                              <option value="">İlçe Seçin</option>
                              {city && Object.keys(AddressData.Türkiye[city]).map((district) => (
                                  <option key={district} value={district}>
                                      {district}
                                  </option>
                              ))}
                          </select>
                          <select
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                              className="form-control mb-3"
                          >
                              <option value="">Mahalle Seçin</option>
                              {district && Object.keys(AddressData.Türkiye[city][district]).map((neighborhood) => (
                                  <option key={neighborhood} value={neighborhood}>
                                      {neighborhood}
                                  </option>
                              ))}
                          </select>
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
                              <th scope="col">Tür</th>
                              <th scope="col">Durum</th>
                              <th scope="col">Tutar</th>
                              <th scope="col">Başlangıç Tarihi</th>
                              <th scope="col">Bitiş Tarihi</th>
                              <th scope="col">Müşteri TCKN</th>
                          </tr>
                      </thead>
                      <tbody>
                          {earthquakePolicies.length > 0 ? (
                              earthquakePolicies.map((earthquakePolicy) => (
                                  <tr key={earthquakePolicy.policyId}>
                                      <td>{earthquakePolicy.policyId}</td>
                                      <td>
                                      <td>{earthquakePolicy.coverage ? earthquakePolicy.coverage.coverageType : ''}</td>
                                      </td>
                                      <td>
                                      {earthquakePolicy.tckn === undefined 
                                          ? '' 
                                          : EarthquakePolicyState[earthquakePolicy.state as keyof typeof EarthquakePolicyState]}
                                      </td>
                                      <td>{earthquakePolicy.policyAmount}</td>
                                      <td>{earthquakePolicy.policyStartDate ? new Date(earthquakePolicy.policyStartDate).toLocaleDateString() : 'Tarih Yok'}</td>
                                      <td>{earthquakePolicy.policyEndDate ? new Date(earthquakePolicy.policyEndDate).toLocaleDateString() : 'Tarih Yok'}</td>
                                      <td>{earthquakePolicy.tckn}</td>
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
}

export default EarthquakePolicyList