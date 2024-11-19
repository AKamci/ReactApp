import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllHealthPolicy } from '../../../infrastructure/Store/Slices/HealthPolicySlices/GetAllHealthPolicy';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { totalRecordHealthPolicy } from '../../../infrastructure/Store/Slices/HealthPolicySlices/TotalRecordOfHealthPolicy';
import Spinner from '../../Shared/Spinner';
import ApiState from '../../../infrastructure/Enums/ApiState';
import HealthPolicyState from '../../../infrastructure/Enums/HealthPolicyState';

const HealthPolicyList = () => {
  const dispatch = useAppDispatch();
  const healthPolicies = useAppSelector((state) => state.allHealthPolicy.data);
  const state = useAppSelector((state) => state.allHealthPolicy.state);

  const totalRecord = useAppSelector((state) => state.totalRecordHealthPolicy.data);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [selectedFilter, setSelectedFilter] = useState<string>(''); 

  const [policyId, setPolicyId] = useState<number | null>(null);
  const [personalHealthId, setPersonalHealthId] = useState<number | null>(null);
  const [tckn, setTckn] = useState<string>('');
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [coverageCode, setCoverageCode] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bloodType, setBloodType] = useState<string>('');
  const [alcoholConsumption, setAlcoholConsumption] = useState<boolean | null>(null);
  const [smokeConsumption, setSmokeConsumption] = useState<boolean | null>(null);
  const [isPregnant, setIsPregnant] = useState<boolean | null>(null);
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [hasPreviousSurgeries, setHasPreviousSurgeries] = useState<boolean | null>(null);
  const [policyOfferDate, setPolicyOfferDate] = useState<string>('');
  const [policyDescription, setPolicyDescription] = useState<string>('');
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);
  const [policyStartDate, setPolicyStartDate] = useState<string>('');
  const [policyEndDate, setPolicyEndDate] = useState<string>('');
  const [policyState, setPolicyState] = useState<string>('');
  const [policyType, setPolicyType] = useState<string>('');

  const toast = useRef<Toast>(null);
  const [filtersCleared, setFiltersCleared] = useState<boolean>(false);

  useEffect(() => {
    dispatch(totalRecordHealthPolicy());
    dispatch(getAllHealthPolicy({ 
      page: first / rows, 
      size: rows,
      policyId,
      personalHealthId,
      tckn: tckn || undefined,
      height,
      weight,
      coverageCode,
      bmi,
      bloodType: bloodType || undefined,
      alcoholConsumption,
      smokeConsumption,
      isPregnant,
      hasDisability,
      hasPreviousSurgeries,
      policyOfferDate: policyOfferDate || undefined,
      policyDescription: policyDescription || undefined,
      policyAmount,
      policyStartDate: policyStartDate || undefined,
      policyEndDate: policyEndDate || undefined,
      state: policyState || undefined
    }));
    console.log(totalRecord);
    console.log("HEALTH POLICIES");
    console.log(healthPolicies);
  }, [first, rows, filtersCleared]);

  const validateTCKN = (tckn: string) => {
    const tcknRegex = /^[0-9]{11}$/;
    return tcknRegex.test(tckn);
  };

  const handleApplyFilter = () => {
    if (selectedFilter === 'tckn' && !validateTCKN(tckn)) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'TCKN 11 haneli ve sadece rakamlardan oluşmalıdır!', life: 3000 });
      return;
    }

    const filters = [];
    if (tckn) filters.push(`TCKN: ${tckn}`);
    if (policyState) filters.push(`Durum: ${policyState}`);
    if (policyType) filters.push(`Tür: ${policyType}`);
    if (bloodType) filters.push(`Kan Grubu: ${bloodType}`);
    if (hasDisability !== null) filters.push(`Engellilik: ${hasDisability ? 'Evet' : 'Hayır'}`);
    if (alcoholConsumption !== null) filters.push(`Alkol Tüketimi: ${alcoholConsumption ? 'Evet' : 'Hayır'}`);
    if (smokeConsumption !== null) filters.push(`Sigara Tüketimi: ${smokeConsumption ? 'Evet' : 'Hayır'}`);
    if (isPregnant !== null) filters.push(`Hamilelik: ${isPregnant ? 'Evet' : 'Hayır'}`);
    if (hasPreviousSurgeries !== null) filters.push(`Önceki Ameliyatlar: ${hasPreviousSurgeries ? 'Evet' : 'Hayır'}`);
    setActiveFilters(filters);

    handleFilterChange();
  };

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleFilterChange = async () => {
    await dispatch(totalRecordHealthPolicy());
    setFirst(0); 
    await dispatch(getAllHealthPolicy({ 
      page: 0, 
      size: rows,
      policyId,
      personalHealthId,
      tckn,
      height,
      weight,
      coverageCode,
      bmi,
      bloodType,
      alcoholConsumption,
      smokeConsumption,
      isPregnant,
      hasDisability,
      hasPreviousSurgeries,
      policyOfferDate,
      policyDescription,
      policyAmount,
      policyStartDate,
      policyEndDate,
      state: policyState
    }));
    await dispatch(totalRecordHealthPolicy());
    console.log(totalRecord);
    console.log("handleFilterChange :");
    console.log(policyId, personalHealthId, tckn, height, weight, coverageCode, bmi, bloodType, alcoholConsumption, smokeConsumption, isPregnant, hasDisability, hasPreviousSurgeries, policyOfferDate, policyDescription, policyAmount, policyStartDate, policyEndDate, policyState);
    console.log(healthPolicies);
  };

  const clearFilters = async () => {
    setPolicyId(null);
    setPersonalHealthId(null);
    setTckn('');
    setHeight(null);
    setWeight(null);
    setCoverageCode(null);
    setBmi(null);
    setBloodType('');
    setAlcoholConsumption(null);
    setSmokeConsumption(null);
    setIsPregnant(null);
    setHasDisability(null);
    setHasPreviousSurgeries(null);
    setPolicyOfferDate('');
    setPolicyDescription('');
    setPolicyAmount(null);
    setPolicyStartDate('');
    setPolicyEndDate('');
    setPolicyState('');
    setPolicyType('');
    setActiveFilters([]);
    setSelectedFilter('');
    
    await dispatch(getAllHealthPolicy({ page: 0, size: rows, policyId: null, personalHealthId: null, tckn: undefined, height: null, weight: null, coverageCode: null, bmi: null, bloodType: undefined, alcoholConsumption: null, smokeConsumption: null, isPregnant: null, hasDisability: null, hasPreviousSurgeries: null, policyOfferDate: undefined, policyDescription: undefined, policyAmount: null, policyStartDate: undefined, policyEndDate: undefined, state: undefined }));
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
              <option value="tckn">TCKN'ye Göre</option>
              <option value="policyState">Poliçe Durumuna Göre</option>
              <option value="policyType">Türe Göre</option>
              <option value="bloodType">Kan Grubuna Göre</option>
              <option value="otherFields">Diğer Alanlar</option>
            </select>
          </div>

          {selectedFilter === 'tckn' && (
            <input
              type="text"
              placeholder="TCKN"
              value={tckn}
              onChange={(e) => setTckn(e.target.value)}
              className="form-control mb-3"
            />
          )}

          {selectedFilter === 'policyState' && (
            <select
              value={policyState}
              onChange={(e) => setPolicyState(e.target.value)}
              className="form-control mb-3"
            >
              <option value=''>Poliçe Durumunu Seçin</option>
              {Object.values(HealthPolicyState).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
          {selectedFilter === 'policyType' && (
            <select
              value={coverageCode}
              onChange={(e) => setCoverageCode(parseInt(e.target.value))}
              className="form-control mb-3"
            >
              <option value=''>Poliçe Türünü Seçin</option>
              <option value='107'>SEYEHAT</option>
              <option value='105'>AYAKTA TEDAVİ</option>
              <option value='106'>YATARAK TEDAVİ</option>
            </select>
          )}

          {selectedFilter === 'bloodType' && (
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="form-control mb-3"
            >
              <option value=''>Kan Grubunu Seçin</option>
              <option value='A+'>A+</option>
              <option value='A-'>A-</option>
              <option value='B+'>B+</option>
              <option value='B-'>B-</option>
              <option value='AB+'>AB+</option>
              <option value='AB-'>AB-</option>
              <option value='0+'>0+</option>
              <option value='0-'>0-</option>
            </select>
          )}

          {selectedFilter === 'otherFields' && (
            <div>
              <select
                value={hasDisability === null ? '' : hasDisability.toString()}
                onChange={(e) => setHasDisability(e.target.value === '' ? null : e.target.value === 'true')}
                className="form-control mb-3"
              >
                <option value=''>Engellilik Durumu</option>
                <option value='true'>Evet</option>
                <option value='false'>Hayır</option>
              </select>
              <select
                value={alcoholConsumption === null ? '' : alcoholConsumption.toString()}
                onChange={(e) => setAlcoholConsumption(e.target.value === '' ? null : e.target.value === 'true')}
                className="form-control mb-3"
              >
                <option value=''>Alkol Tüketimi</option>
                <option value='true'>Evet</option>
                <option value='false'>Hayır</option>
              </select>
              <select
                value={smokeConsumption === null ? '' : smokeConsumption.toString()}
                onChange={(e) => setSmokeConsumption(e.target.value === '' ? null : e.target.value === 'true')}
                className="form-control mb-3"
              >
                <option value=''>Sigara Tüketimi</option>
                <option value='true'>Evet</option>
                <option value='false'>Hayır</option>
              </select>
              <select
                value={isPregnant === null ? '' : isPregnant.toString()}
                onChange={(e) => setIsPregnant(e.target.value === '' ? null : e.target.value === 'true')}
                className="form-control mb-3"
              >
                <option value=''>Hamilelik Durumu</option>
                <option value='true'>Evet</option>
                <option value='false'>Hayır</option>
              </select>
              <select
                value={hasPreviousSurgeries === null ? '' : hasPreviousSurgeries.toString()}
                onChange={(e) => setHasPreviousSurgeries(e.target.value === '' ? null : e.target.value === 'true')}
                className="form-control mb-3"
              >
                <option value=''>Önceki Ameliyatlar</option>
                <option value='true'>Evet</option>
                <option value='false'>Hayır</option>
              </select>
            </div>
          )}

          <div>
            <button onClick={handleApplyFilter} className="btn btn-primary col-2">Filtrele</button>
            <button onClick={clearFilters} className="btn btn-secondary col-2">Temizle</button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Poliçe No</th>
                <th scope="col">TCKN</th>
                <th scope="col">Kan Grubu</th>
                <th scope="col">Tür</th>
                <th scope="col">Durum</th>
                <th scope="col">Tutar</th>
                <th scope="col">Başlangıç Tarihi</th>
                <th scope="col">Bitiş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {healthPolicies.length > 0 ? (
                healthPolicies.map((healthPolicy) => (
                  <tr key={healthPolicy.policyId}>
                    <td>{healthPolicy.policyId}</td>
                    <td>{healthPolicy.tckn}</td>
                    <td>{healthPolicy.bloodType}</td>
                    <td>{healthPolicy.coverage ? healthPolicy.coverage.coverageType : ''}</td>
                    <td>{healthPolicy.state}</td>
                    <td>{healthPolicy.policyAmount}</td>
                    <td>{healthPolicy.policyStartDate ? new Date(healthPolicy.policyStartDate).toLocaleDateString() : 'Tarih Yok'}</td>
                    <td>{healthPolicy.policyEndDate ? new Date(healthPolicy.policyEndDate).toLocaleDateString() : 'Tarih Yok'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">Veri Bulunamadı</td>
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

export default HealthPolicyList