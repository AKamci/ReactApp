import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getHealthPolicy, resetHealthPolicyState } from '../../../infrastructure/Store/Slices/HealthPolicySlices/GetHealthPolicy';
import { InputText } from "primereact/inputtext";
import { deleteHealthPolicy } from '../../../infrastructure/Store/Slices/HealthPolicySlices/DeleteHealthPolicy';
import { useNavigate } from 'react-router-dom';
import { HealthPolicyDto } from '../../../infrastructure/dto/HealthPolicyDto';
import { Toast } from 'primereact/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Shared/Spinner';
import CarPolicyStateEnum from '../../../infrastructure/Enums/CarPolicyStateEnum';
import CarPolicyState from '../../../infrastructure/Enums/CarPolicyStateEnum';

const GetHealthPolicy = () => {
  const dispatch = useAppDispatch();
  const healthPolicyEntity = useAppSelector((state) => state.getHealthPolicy.data);
  const responseStatus = useAppSelector((state) => state.getHealthPolicy.responseStatus);
  const responseStateOfHealthPolicy = useAppSelector((state) => state.getHealthPolicy.state);
  const [loading, setLoading] = useState<boolean>(false);
  const [policyId, setPolicyId] = useState<number>(0);
  const toastRef = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {    
    return () => {
      dispatch(resetHealthPolicyState()); 
    };
  }, [dispatch]);

  const load = async () => {
    console.log(policyId);
    setLoading(true);  

    const response = await dispatch(getHealthPolicy({ policyId }));

    if (response.meta.requestStatus === 'fulfilled') {
      console.log(response.payload, "response.payload");
      console.log("FULFILLED");
      console.log(healthPolicyEntity);

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

  const removeHealthPolicy = async (policyId: number) => {
    try {
      console.log(policyId, "policyId");
      const resultAction = await dispatch(deleteHealthPolicy({ policyId }));

      console.log(resultAction, "resultAction");

      if (resultAction.meta.requestStatus === 'fulfilled') {
        toastRef.current?.show({
          severity: 'success',
          summary: 'Bilgi',
          detail: 'Poliçe Başarılı Bir Şekilde Silinmiştir.',
          life: 2000
        });
        dispatch(resetHealthPolicyState())
      } else {
        toastRef.current?.show({
          severity: 'error',
          summary: 'Hata',
          detail: 'Silerken Bir Hata Oldu',
          life: 2000
        });
        dispatch(resetHealthPolicyState())
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Lütfen Tekrar Deneyiniz. İşleminiz Yapılamadı.',
        life: 2000
      });
      dispatch(resetHealthPolicyState())
    }
  };

  const updateHealthPolicyFunc = (healthPolicy: HealthPolicyDto) => {
    const healthPolicyData = {
      healthPolicy,
      policyId
    };
    navigate('/healthPolicy/updateHealthPolicy', { state: { healthPolicy: healthPolicyData } });
  };

  const dataToDisplay = Array.isArray(healthPolicyEntity) ? healthPolicyEntity : healthPolicyEntity ? [healthPolicyEntity] : [];
  console.log(dataToDisplay, "dataToDisplay");

  return (
    <div>
      <Toast ref={toastRef} />
      <h3>POLİÇE NUMARASINI GİRİNİZ</h3>
      <div className="card flex justify-content-center">
        <InputText 
          keyfilter="int" 
          placeholder="POLİÇE NUMARASI GİRİNİZ" 
          value={policyId.toString()} 
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
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((healthPolicy) => (
              <tr key={`${healthPolicy.policyId || 'default'}-${healthPolicy.tckn || 'default'}`}>
                <td>{healthPolicy.tckn === undefined ? '' : healthPolicy.policyId}</td>
                <td>{healthPolicy.coverage ? healthPolicy.coverage.coverageType : ''}</td>
                <td>
                  {healthPolicy.tckn === undefined 
                    ? '' 
                    : CarPolicyState[healthPolicy.state as keyof typeof CarPolicyState]}
                </td>
                <td>{healthPolicy.policyStartDate ? new Date(healthPolicy.policyStartDate).toLocaleDateString() : ''}</td>
                <td>{healthPolicy.policyEndDate ? new Date(healthPolicy.policyEndDate).toLocaleDateString() : ''}</td>
                <td>{healthPolicy.policyAmount}</td>
                <td>{healthPolicy.tckn}</td>
                <td>{healthPolicy.policyOfferDate}</td>
                <td>
                  {healthPolicy.policyAmount > 0 && healthPolicy.state === CarPolicyStateEnum.CREATED && (
                    <button className="btn btn-danger" onClick={() => removeHealthPolicy(healthPolicy.policyId)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
                <td>
                  {healthPolicy.policyAmount > 0 && healthPolicy.state === CarPolicyStateEnum.CREATED && (
                    <button className="btn btn-info" onClick={() => updateHealthPolicyFunc(healthPolicy)}>
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

export default GetHealthPolicy