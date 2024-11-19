import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { useEffect, useState } from 'react';
import { getHouseWithCustomer } from '../../../infrastructure/Store/Slices/HouseSlices/GetHouseWithCustomer-Slice';
import { acceptCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/AcceptCarPolicy';
import { Calendar } from 'primereact/calendar';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { rejectEarthquakePolicy } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/RejectEarthquakePolicy';
import { acceptEarthquakePolicy } from '../../../infrastructure/Store/Slices/EarthQuakeSlices/AcceptEarthquakePolicy';
import { acceptHealthPolicy } from '../../../infrastructure/Store/Slices/HealthPolicySlices/AcceptHealthPolicy';


const UpdateHealthPolicy = () => {
  const dispatch = useAppDispatch();
  const healthPolicy = useAppSelector((state) => state.updateHealthPolicy.data);
  const healthPolicyEntity = useAppSelector((state) => state.getHealthPolicy.data);
  const responseStatus = useAppSelector((state) => state.getHealthPolicy.responseStatus);

  const earthquakePolicyInformation = useAppSelector((state) => state.getHouseWithCustomer.data);



  const location = useLocation();

  const healthPolicyData = location.state?.healthPolicy.healthPolicy;

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef(null);
  const [policyDescription, setPolicyDescription] = useState(''); 
  const [policyType, setPolicyType] = useState('');
  const [policyStatus, setPolicyStatus] = useState(false);
  const [policyStartDate, setPolicyStartDate] = useState<Date | null>(null);
  const [policyEndDate, setPolicyEndDate] = useState<Date | null>(null);
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);
  const [policyId, setPolicyId] = useState<number | null>(null);
  const[policyOfferDate, setPolicyOfferDate] = useState<Date | null>(null);
  const [plate, setLicensePlateNumber] = useState('');



  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);


  const navigate = useNavigate();

  const [descriptionValid, setDescriptionValid] = useState<boolean>(false);

  useEffect(() => {
    if (healthPolicyData) {
      console.log(healthPolicyData)
      setLicensePlateNumber(healthPolicyData.licensePlateNumber || '');
      setPolicyOfferDate(healthPolicyData.policyOfferDate ? new Date(healthPolicyData.policyOfferDate) : null);
      setPolicyOfferDate(healthPolicyData.policyStartDate ? new Date(healthPolicyData.policyStartDate) : null);
      setPolicyDescription(healthPolicyData.coverage ? healthPolicyData.coverage.coverageDescription : '');
      setPolicyType(healthPolicyData.coverage ? healthPolicyData?.coverage.coverageType : '');
      setPolicyStatus(healthPolicyData.policyStatus || false);
      setPolicyStartDate(healthPolicyData.policyStartDate ? new Date(healthPolicyData.policyStartDate) : null);
      setPolicyEndDate(healthPolicyData.policyEndDate ? new Date(healthPolicyData.policyEndDate) : null);
      setPolicyAmount(healthPolicyData.policyAmount || null);
      setPolicyId(healthPolicyData.policyId || null);
    }
  }, [healthPolicyData]); 
  
  useEffect(() => {
    if (policyOfferDate) {
      console.log("Trigger Open");
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - policyOfferDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
      if (differenceInDays > 30) {
        console.log("Fark 30");
        console.log(plate, policyType, policyStartDate, policyEndDate);
  
        dispatch(
          getHouseWithCustomer({
            policyType,
            policyStartDate: policyStartDate ? policyStartDate.toISOString().split("T")[0] : null,
            policyEndDate: policyEndDate ? policyEndDate.toISOString().split("T")[0] : null,
          })
        )
          .unwrap()
          .then((result) => {
            if (result.Amount !== policyAmount) {
              console.log("Fiyat Güncellendi");
              setPolicyAmount(result.Amount);
            }
          });
  
        setShouldOpenModal(true);
      }
    }
  }, [policyOfferDate, dispatch]);

  const validateForm = () => {
    if (!policyDescription || !policyType || !policyStartDate || !policyEndDate || policyAmount === null) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
      return false;
    }

    if (
      policyDescription === healthPolicyData.policyDescription &&
      policyType === healthPolicyData.policyType &&
      policyStatus === healthPolicyData.policyStatus &&
      policyAmount === healthPolicyData.policyAmount &&
      policyStartDate?.toISOString().split('T')[0] === new Date(healthPolicyData.policyStartDate).toISOString().split('T')[0] &&
      policyEndDate?.toISOString().split('T')[0] === new Date(healthPolicyData.policyEndDate).toISOString().split('T')[0]
    ) {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Hiçbir değişiklik yapılmadı.', life: 3000 });
      return false;
    }

    if (!descriptionValid) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Geçersiz kullanım.', life: 3000 });
      return false;
    }

    return true;
  };
  
  const accept = async () => {
   
    console.log(policyId, "policyId");
    dispatch(acceptHealthPolicy({ policyId }));

    setLoading(true);
    await toast.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Poliçe Başarıyla Güncellendi.', life: 2000 });

    setTimeout(() => {
      setLoading(false);
      navigate('/healthPolicy/list');
    }, 2000);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setVisible(true);
    }
  };

  const validateDescription = (value: string) => {
    setDescriptionValid(value.length > 0 && value.length <= 500);
    setPolicyDescription(value);
  };

  const getInputStyle = (isValid: boolean | undefined) => {
    if (isValid === undefined) return {};
    return { borderColor: isValid ? 'green' : 'red' };
  };




  const reject = async () => {
    
    dispatch(rejectHealthPolicy({ policyId}));

    setLoading(true);
    toast.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Poliçe Başarıyla Güncellendi.', life: 2000 });

    setTimeout(() => {
      setLoading(false);
      navigate('/healthPolicy/list');
    }, 2000);
  };

  return (
    
  <div>

  {shouldOpenModal && (
  <div
      className="modal fade show"
      style={{ display: 'block' }}
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
     >

    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="staticBackdropLabel">Fiyat Güncellemesi.</h5>
          <button type="button" className="btn-close"  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          Verilen fiyat teklifinin süresi dolduğu için yeni teklifi alınmıştır.
          <strong></strong>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShouldOpenModal(false)} data-bs-dismiss="modal">Anladım</button>        
        </div>
      </div>
    </div>
  </div>
)}

<Toast ref={toast} />
    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
      <div className="col-md-2">
        <label htmlFor="inputPolicyId" className="form-label">Poliçe No</label>
        <input
          type="text"
          className="form-control"
          id="inputPolicyName"
          value={policyId}
          disabled
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="inputPolicyDescription" className="form-label">Poliçe Açıklaması</label>
        <textarea
          className="form-control"
          id="inputPolicyDescription"
          value={policyDescription}
          disabled
          onChange={(e) => validateDescription(e.target.value)}
        />
      </div>


      <div className="col-md-2">
        <label htmlFor="inputPolicyType" className="form-label">Poliçe Türü</label>
        <input
          type="text"
          className="form-control"
          id="inputPolicyName"
          value={policyType}          
          disabled
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="policyStartDate" className="form-label">Başlangıç Tarihi</label>
        <Calendar
          value={policyStartDate}
          onChange={(e) => setPolicyStartDate(e.value as Date)}
          showIcon
          disabled
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="policyEndDate" className="form-label">Bitiş Tarihi</label>
        <Calendar
          value={policyEndDate}
          onChange={(e) => setPolicyEndDate(e.value as Date)}
          showIcon
          disabled
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="policyAmount" className="form-label">Tutar</label>
        <input
          type="number"
          className="form-control"
          id="policyAmount"
          value={policyAmount}
          disabled
          onChange={(e) => setPolicyAmount(Number(e.target.value))}
        />
      </div>

      <div className="col-12">
  <ConfirmPopup
    target={buttonEl.current || undefined}
    visible={visible}
    onHide={() => setVisible(false)}
    message="Poliçeyi güncellemek istediğinize emin misiniz?"
    icon="pi pi-exclamation-triangle"
    accept={accept}
    reject={reject}
    acceptLabel="Evet"
    rejectLabel="Hayır"
  />

  <Button
    ref={buttonEl}
    label="Kabul Et"
    type="button"
    className="p-button-success"
    icon="pi pi-check"
    onClick={accept}
    style={{ marginRight: '10px' }} 
  />

  <Button
    ref={buttonEl}
    label="Reddet"
    type="button"
    className="p-button-danger"
    icon="pi pi-times"
    onClick={reject}
  />
</div>    
    </form>

    </div>
  );
}

export default UpdateHealthPolicy