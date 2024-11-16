import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getCarPolicy, resetCarPolicyState } from '../../../infrastructure/Store/Slices/CarPolicySlices/GetCarPolicy-Slice';
import { InputText } from "primereact/inputtext";
import { deleteCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/DeleteCarPolicy-Slice';
import { useNavigate } from 'react-router-dom';
import { CarPolicyDto } from '../../../infrastructure/dto/CarPolicyDto';
import { Toast } from 'primereact/toast';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import  Spinner  from '../../Shared/Spinner';
import CarPolicyStateEnum from '../../../infrastructure/Enums/CarPolicyStateEnum';
import CarPolicyState from '../../../infrastructure/Enums/CarPolicyStateEnum';
import { resetEarthquakePolicyState } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/GetEarthquake-Slice';
import { getEarthquakePolicy } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/GetEarthquake-Slice';
import { deleteEarthquakePolicy } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/DeleteEarthquake-Slice';
import { EarthquakePolicyDto } from '../../../infrastructure/dto/EarthquakePolicyDto';



const GetEarthquakePolicy = () => {
  const dispatch = useAppDispatch();
  const earthquakePolicyEntity = useAppSelector((state) => state.getEarthquakePolicy.data);
  const responseStatus = useAppSelector((state) => state.getEarthquakePolicy.responseStatus);
  
  const responseStateOfEarthquakePolicy = useAppSelector((state) => state.getEarthquakePolicy.state);
  const [loading, setLoading] = useState<boolean>(false);
  const [policyId, setPolicyId] = useState<number>(0);
  const toastRef = useRef<Toast>(null);
  const navigate = useNavigate();


  useEffect(() => {    
      return () => {
          dispatch(resetEarthquakePolicyState()); 
      };
  }, [dispatch]);


  const load = async () => {
      console.log(policyId);
      setLoading(true);  
  
      const response = await dispatch(getEarthquakePolicy({ policyId }));
  
      if (response.meta.requestStatus === 'fulfilled') {
          console.log(response.payload, "response.payload");
          console.log("FULFILLED");
          console.log(earthquakePolicyEntity);

          toastRef.current?.show({
              severity: 'success',
              summary: 'Bilgi',
              detail: 'Poliçe Bulundu.',
              life: 2000
          });
      } else if (response.meta.requestStatus === 'rejected') {

          const error = response.payload; 
  
          if (error && error.status === 404) {
              toastRef.current?.show({
                  severity: 'error',
                  summary: 'Uyarı',
                  detail: 'Poliçe Bulunamadı.',
                  life: 2000
              });
          } else {
              toastRef.current?.show({
                  severity: 'error',
                  summary: 'Hata',
                  detail: 'Sunucuya ulaşılamadı.',
                  life: 3000
              });
          }
      }
  
      setLoading(false);
  };

  const removeCarPolicy = async (policyId: number) => {
      try {
          console.log(policyId, "policyId");
          const resultAction = await dispatch(deleteEarthquakePolicy({ policyId }));

          console.log(resultAction, "resultAction");

          if (resultAction.meta.requestStatus === 'fulfilled') {
              toastRef.current?.show({
                  severity: 'success',
                  summary: 'Bilgi',
                  detail: 'Poliçe Başarılı Bir Şekilde Silinmiştir.',
                  life: 2000
              });
              dispatch(resetCarPolicyState())
          } else {
              toastRef.current?.show({
                  severity: 'error',
                  summary: 'Hata',
                  detail: 'Silerken Bir Hata Oldu',
                  life: 2000
              });
              dispatch(resetCarPolicyState())
          }
      } catch (error) {
          console.error('Error during deletion:', error);
          toastRef.current?.show({
              severity: 'error',
              summary: 'Hata',
              detail: 'Lütfen Tekrar Deneyiniz. İşleminiz Yapılamadı.',
              life: 2000
          });
          dispatch(resetCarPolicyState())
      }
  };

  const updateEarthquakePolicyFunc = (earthquakePolicy: EarthquakePolicyDto) => {
      const earthquakePolicyData = {
          earthquakePolicy,
          policyId
      };
      navigate('/earthquakePolicy/updateEarthquakePolicy', { state: { earthquakePolicy: earthquakePolicyData } });
  };

  const dataToDisplay = Array.isArray(earthquakePolicyEntity) ? earthquakePolicyEntity : earthquakePolicyEntity ? [earthquakePolicyEntity] : [];
  console.log(dataToDisplay, "dataToDisplay");

  return (
      <div>
          <Toast ref={toastRef} />
          <h3>POLİÇE NUMARASINI GİRİNİZ</h3>
          <div className="card flex justify-content-center">
              <InputText 
                  keyfilter="int" 
                  placeholder="POLİÇE NUMARASI GİRİNİZ" 
                  value={policyId} 
                  onChange={(e) => setPolicyId(Number(e.target.value))}
              />
          </div>
          <div className="card flex flex-wrap justify-content-center gap-3">
              <button type="button" className="btn btn-primary" onClick={load}> ARAMA </button>
          </div>
          {loading ? (
              <div className="flex justify-content-center">
                  <Spinner color='primary' />
              </div>
          ) : (
              <table className="table">
                  <thead>
                      <tr>
                          <th scope="col">Poliçe No</th>
                          <th scope="col">Tür</th>
                          <th scope="col">Durum</th>
                          <th scope="col">Başlangıç Tarihi</th>
                          <th scope="col">Bitiş Tarihi</th>
                          <th scope="col">Tutar</th>
                          <th scope="col">Müşteri TCKN</th>
                          <th scope="col">Teklif Tarihi</th>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {dataToDisplay.map((carPolicy) => (
                          <tr key={`${carPolicy.policyId || 'default'}-${carPolicy.tckn || 'default'}`}>
                              <td>{carPolicy.tckn === undefined ? '' : carPolicy.policyId}</td>
                              <td>{carPolicy.coverage ? carPolicy.coverage.coverageType : ''}</td>
                              <td>
                              {carPolicy.tckn === undefined 
                                  ? '' 
                                  : CarPolicyState[carPolicy.state as keyof typeof CarPolicyState]}
                              </td>
                              <td>{carPolicy.policyStartDate ? new Date(carPolicy.policyStartDate).toLocaleDateString() : ''}</td>
                              <td>{carPolicy.policyEndDate ? new Date(carPolicy.policyEndDate).toLocaleDateString() : ''}</td>
                              <td>{carPolicy.policyAmount}</td>
                              <td>{carPolicy.tckn}</td>
                              <td>{carPolicy.policyOfferDate}</td>
                              <td>
                                  {earthquakePolicyEntity.policyAmount > 0 && carPolicy.state === CarPolicyStateEnum.CREATED && (
                                          <button className="btn btn-danger" onClick={() => removeCarPolicy(carPolicy.policyId)}>
                                          <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                  )}
                              </td>
                              <td>
                                  {earthquakePolicyEntity.policyAmount > 0 && carPolicy.state === CarPolicyStateEnum.CREATED && (
                                      <button className="btn btn-info" onClick={() => updateEarthquakePolicyFunc(carPolicy)}>
                                          <FontAwesomeIcon icon={faPen} />
                                      </button>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </div>
  );
};

export default GetEarthquakePolicy