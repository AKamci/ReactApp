import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { updateCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/UpdateCarPolicy-Slice';

const UpdateCarPolicy = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.updateCarPolicy.state);
  const carPolicy = useAppSelector((state) => state.updateCarPolicy.data);
  const activeCarPolicy = useAppSelector((state) => state.updateCarPolicy.activeRequest);

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef(null);
  const [policyName, setPolicyName] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [policyStatus, setPolicyStatus] = useState(false);
  const [policyStartDate, setPolicyStartDate] = useState<Date | null>(null);
  const [policyEndDate, setPolicyEndDate] = useState<Date | null>(null);
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const carPolicyData = location.state?.carPolicy.carPolicy;

  useEffect(() => {
    console.log("carPolicyData")
    console.log(carPolicyData)
    if (carPolicyData) {
      setPolicyName(carPolicyData.policyName || '');
      setPolicyDescription(carPolicyData.policyDescription || '');
      setPolicyType(carPolicyData.policyType || '');
      setPolicyStatus(carPolicyData.policyStatus || false);
      setPolicyStartDate(carPolicyData.policyStartDate ? new Date(carPolicyData.policyStartDate) : null);
      setPolicyEndDate(carPolicyData.policyEndDate ? new Date(carPolicyData.policyEndDate) : null);
      setPolicyAmount(carPolicyData.policyAmount || null);
    }
  }, [carPolicyData]);

  const validateForm = () => {
    if (!policyName || !policyDescription || !policyType || !policyStartDate || !policyEndDate || !policyAmount) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
      return false;
    }
    return true;
  };

  const accept = async () => {
    const formData = {
    
      policyName,
      policyDescription,
      policyType,
      policyStatus,
      policyStartDate: policyStartDate ? policyStartDate.toISOString().split('T')[0] : null,
      policyEndDate: policyEndDate ? policyEndDate.toISOString().split('T')[0] : null,
      policyAmount,
    };

    console.log(JSON.stringify(formData, null, 2));

    dispatch(updateCarPolicy({
      dto: formData
    }));

    setLoading(true);
    await toast.current?.show({ severity: 'info', summary: 'Mesaj', detail: 'Poliçe Başarıyla Güncellendi.', life: 2000 });

    setTimeout(() => {
      setLoading(false);
      navigate('/carPolicy/carPolicyList');
    }, 2000);
  };

  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Poliçeyi güncellemek için onay vermelisiniz.', life: 2000 });
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setVisible(true);
    }
  };

  return (
    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>

    <div className="col-md-3">
        <label htmlFor="inputPolicyName" className="form-label">Poliçe No</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPolicyName" 
          value={carPolicyData.id}
          disabled={loading} 
          onChange={(e) => setPolicyName(e.target.value)} 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPolicyName" className="form-label">Poliçe Adı</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPolicyName" 
          value={policyName}
          disabled={loading} 
          onChange={(e) => setPolicyName(e.target.value)} 
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="inputPolicyDescription" className="form-label">Poliçe Açıklaması</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPolicyDescription" 
          value={policyDescription}
          disabled={loading} 
          onChange={(e) => setPolicyDescription(e.target.value)} 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPolicyType" className="form-label">Poliçe Türü</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPolicyType" 
          value={policyType}
          disabled={loading} 
          onChange={(e) => setPolicyType(e.target.value)} 
        />
      </div>
      <div className="col-md-2">
        <label htmlFor="inputPolicyAmount" className="form-label">TCKN</label>
        <input 
          type="number" 
          className="form-control" 
          id="inputPolicyAmount" 
          value={policyAmount || ''} 
          disabled={loading} 
          onChange={(e) => setPolicyAmount(Number(e.target.value))} 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPolicyType" className="form-label">Plaka</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPolicyType" 
          value={policyType}
          disabled={loading} 
          onChange={(e) => setPolicyType(e.target.value)} 
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="inputPolicyStatus" className="form-label">Poliçe Durumu</label>
        <select
          className="form-select"
          id="inputPolicyStatus"
          value={policyStatus ? 'true' : 'false'}
          onChange={(e) => setPolicyStatus(e.target.value === 'true')}
          disabled={loading}
        >
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPolicyStartDate" className="form-label">Başlangıç Tarihi</label>
        <Calendar 
          id="inputPolicyStartDate" 
          value={policyStartDate} 
          onChange={(e) => setPolicyStartDate(e.value)} 
          dateFormat="yy-mm-dd" 
          disabled={loading}
          showIcon 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPolicyEndDate" className="form-label">Bitiş Tarihi</label>
        <Calendar 
          id="inputPolicyEndDate" 
          value={policyEndDate} 
          onChange={(e) => setPolicyEndDate(e.value)} 
          dateFormat="yy-mm-dd" 
          disabled={loading}
          showIcon 
        />
      </div>

      <div className="col-12">
        <Toast ref={toast} />
        <ConfirmPopup
          target={buttonEl.current} 
          visible={visible} 
          onHide={() => setVisible(false)} 
          message="Poliçeyi güncellemek üzeresiniz" 
          icon="pi pi-exclamation-triangle" 
          accept={accept} 
          reject={reject} 
          acceptLabel="Evet" 
          rejectLabel="Hayır"
        />
        <div className="card flex justify-content-center col-2">
          <Button ref={buttonEl} onClick={handleConfirm} disabled={loading} icon="pi pi-check" label={loading ? 'Yönlendiriliyor...' : 'Onayla'} />
        </div>
      </div>
    </form>
  );
};

export default UpdateCarPolicy;
