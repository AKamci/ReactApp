import { useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { updateCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/UpdateCarPolicy-Slice';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { getCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/GetCarPolicy-Slice';
import { getPlateWithCustomer } from '../../../infrastructure/Store/Slices/LicensePlateSlices/GetPlateWithCustomer-Slice';

const UpdateCarPolicy = () => {
  const dispatch = useAppDispatch();
  const carPolicy = useAppSelector((state) => state.updateCarPolicy.data);
  const carPolicyEntity = useAppSelector((state) => state.getCarPolicy.data);
  const responseStatus = useAppSelector((state) => state.getCarPolicy.responseStatus);

  const carPolicyInformation = useAppSelector((state) => state.getPlateWithCustomer.data);



  const location = useLocation();

  const carPolicyData = location.state?.carPolicy.carPolicy;

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
    if (carPolicyData) {
      console.log(carPolicyData)
      setLicensePlateNumber(carPolicyData.licensePlateNumber || '');
      setPolicyOfferDate(carPolicyData.policyOfferDate ? new Date(carPolicyData.policyOfferDate) : null);
      setPolicyOfferDate(carPolicyData.policyStartDate ? new Date(carPolicyData.policyStartDate) : null);
      setPolicyDescription(carPolicyData.policyDescription || '');
      setPolicyType(carPolicyData.policyType || '');
      setPolicyStatus(carPolicyData.policyStatus || false);
      setPolicyStartDate(carPolicyData.policyStartDate ? new Date(carPolicyData.policyStartDate) : null);
      setPolicyEndDate(carPolicyData.policyEndDate ? new Date(carPolicyData.policyEndDate) : null);
      setPolicyAmount(carPolicyData.policyAmount || null);
      setPolicyId(carPolicyData.policyId || null);
    }
  }, [carPolicyData]); 
  
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
          getPlateWithCustomer({
            plate,
            policyType,
            policyStartDate: policyStartDate ? policyStartDate.toISOString().split("T")[0] : null,
            policyEndDate: policyEndDate ? policyEndDate.toISOString().split("T")[0] : null,
          })
        )
          .unwrap()
          .then((result) => {
            if (result.amount !== policyAmount) {
              console.log("Fiyat Güncellendi");
              setPolicyAmount(result.amount);
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
      policyDescription === carPolicyData.policyDescription &&
      policyType === carPolicyData.policyType &&
      policyStatus === carPolicyData.policyStatus &&
      policyAmount === carPolicyData.policyAmount &&
      policyStartDate?.toISOString().split('T')[0] === new Date(carPolicyData.policyStartDate).toISOString().split('T')[0] &&
      policyEndDate?.toISOString().split('T')[0] === new Date(carPolicyData.policyEndDate).toISOString().split('T')[0]
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
    const formData = {
      policyId,
      policyDescription,
      policyType,
      policyStatus,
      policyStartDate: policyStartDate ? policyStartDate.toISOString().split('T')[0] : null,
      policyEndDate: policyEndDate ? policyEndDate.toISOString().split('T')[0] : null,
      policyAmount,
    };

    console.log(JSON.stringify(formData, null, 2));

    dispatch(updateCarPolicy({ dto: formData }));

    setLoading(true);
    await toast.current?.show({ severity: 'info', summary: 'Mesaj', detail: 'Poliçe Başarıyla Güncellendi.', life: 2000 });

    setTimeout(() => {
      setLoading(false);
      navigate('/carPolicy/list');
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




  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Poliçe oluşturmak için onay vermelisiniz.', life: 2000 });
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
          disabled={loading}
          onChange={(e) => validateDescription(e.target.value)}
          style={getInputStyle(descriptionValid)}
        />
        <span className="input-group-text">
          {descriptionValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>
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

      <div className="col-md-2">
        <label htmlFor="inputPolicyStatus" className="form-label">Durum</label>
        <input
          type="checkbox"
          className="form-check-input"
          id="inputPolicyStatus"
          checked={policyStatus}
          disabled={loading}
          onChange={(e) => setPolicyStatus(e.target.checked)}
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="policyStartDate" className="form-label">Başlangıç Tarihi</label>
        <Calendar
          value={policyStartDate}
          onChange={(e) => setPolicyStartDate(e.value as Date)}
          showIcon
          disabled={loading}
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="policyEndDate" className="form-label">Bitiş Tarihi</label>
        <Calendar
          value={policyEndDate}
          onChange={(e) => setPolicyEndDate(e.value as Date)}
          showIcon
          disabled={loading}
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="policyAmount" className="form-label">Tutar</label>
        <input
          type="number"
          className="form-control"
          id="policyAmount"
          value={policyAmount}
          disabled={loading}
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
          acceptLabel='Evet'
          rejectLabel='Hayır'
        />

        <Button
          ref={buttonEl}
          label={loading ? 'Yükleniyor...' : 'Poliçeyi Güncelle'}
          type="submit"
          icon="pi pi-check"
          disabled={loading}
          onClick={handleConfirm}
        />
      </div>


      <Toast ref={toast} />
    </form>

    </div>
  );

};

export default UpdateCarPolicy;
