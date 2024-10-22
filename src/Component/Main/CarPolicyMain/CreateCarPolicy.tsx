import { useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { updateCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/UpdateCarPolicy-Slice';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { createCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/CreateCarPolicy-Slice';

const CreateCarPolicy = () => {
  const dispatch = useAppDispatch();
  const carPolicy = useAppSelector((state) => state.createCarPolicy.data);



  const [savedPolicy, setSavedPolicy] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef(null);
  const [policyName, setPolicyName] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');
  const [plate, setPlate] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [policyStatus, setPolicyStatus] = useState(false);
  const [policyStartDate, setPolicyStartDate] = useState<Date | null>(null);
  const [policyEndDate, setPolicyEndDate] = useState<Date | null>(null);
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);
  const navigate = useNavigate();

  const [nameValid, setNameValid] = useState<boolean>(false);
  const [descriptionValid, setDescriptionValid] = useState<boolean>(false);
  const [plateValid, setPlateValid] = useState<boolean>(false);


  const validateForm = () => {
    if (!policyName || !policyDescription || !policyType || !policyStartDate || !policyEndDate || !plate) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
      return false;
    }

    if (!nameValid || !descriptionValid || !plateValid) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Geçersiz kullanım.', life: 3000 });
      return false;
    }

    return true;
  };

  const accept = async () => {


    //Plaka ile bilgilerin getirtilip ardından modala yazdırılma işlemi
    
    //Gelen dataya göre kullamnıcı bilgilendirme ekranı.


    //Kullanıcı onayı verdiği gibi poliçeyi oluştur.

    const formData = {
      policyName,
      policyDescription,
      policyType,
      policyStatus,
      policyStartDate: policyStartDate ? policyStartDate.toISOString().split('T')[0] : null,
      policyEndDate: policyEndDate ? policyEndDate.toISOString().split('T')[0] : null,
      plate,
    };

    console.log(JSON.stringify(formData, null, 2));

    dispatch(createCarPolicy({ dto: formData }));

    setLoading(true);
    await toast.current?.show({ severity: 'info', summary: 'Mesaj', detail: 'Poliçe Başarıyla Güncellendi.', life: 2000 });


  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setVisible(true);
    }
  };

  const validateName = (value: string) => {
    const regex = /^[A-Za-zğüşıöçĞÜŞİÖÇ\s]*$/;
    setNameValid(regex.test(value) && value.length <= 255);
    setPolicyName(value);
  };

  const validateDescription = (value: string) => {
    setDescriptionValid(value.length > 0 && value.length <= 500);
    setPolicyDescription(value);
  };
  
  const validatePlate = (value: string) => {
    const regex = /^(0[1-9]|[1-7][0-9]|8[01])(([A-PR-VYZ])(\d{4,5})|([A-PR-VYZ]{2})(\d{3,4})|([A-PR-VYZ]{3})(\d{2,3}))$/
    setPlateValid(regex.test(value))
    console.log(value)
    setPlate(value)

  }

  const getInputStyle = (isValid: boolean | undefined) => {
    if (isValid === undefined) return {};
    return { borderColor: isValid ? 'green' : 'red' };
  };


  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Poliçe oluşturmak için onay vermelisiniz.', life: 2000 });
  };

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+ 1);

  return (
    <div>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">POLİÇE ANTLAŞMASI</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        
          <div>
            <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                ARAÇ BİLGİLERİ
              </button>
            </h2>
            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">...</div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                MÜŞTERİ BİLGİLERİ
              </button>
            </h2>
            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">...</div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                POLİÇE BİLGİLERİ
              </button>
            </h2>
            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">...</div>
            </div>
          </div>
          
          <br />
          <div className="col-4">
        <label htmlFor="inputPolicyStatus" className="form-label">ONAY{" -->"}</label>
        
        <input
          type="checkbox"
          className="form-check-input"
          id="inputPolicyStatus"
          checked={policyStatus}
          disabled={loading}
          onChange={(e) => setPolicyStatus(e.target.checked)}
        />
      </div>

      <div className="col-4">
        <label htmlFor="inputSave" className="form-label">TEKLİFİ KAYDET{" -->"}</label>  
        <input
          type="checkbox"
          className="form-check-input"
          id="inputSave"
          checked={savedPolicy}
          disabled={loading}
          onChange={(e) => setSavedPolicy(e.target.checked)}
        />
      </div>
      <br />
      <div>
      <p className="text-primary" >
        ONAY VERİLMESİ DURUMUNDA TEKLİF OTOMATİK KAYDEDİLECEKTİR <a className="text-reset"></a>.
      </p>
       
      </div>

        </div>
          </div>

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Kapat</button>
        <button type="button" className="btn btn-success">Onaylıyorum</button>
      </div>
    </div>
  </div>
</div>

    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
      
      <div className="col-3">
        <label htmlFor="inputPolicyName" className="form-label">Poliçe İsmi</label>
        <input
          type="text"
          className="form-control"
          id="inputPolicyName"
          value={policyName}
          disabled={loading}
          onChange={(e) => validateName(e.target.value)}
          style={getInputStyle(nameValid)}
        />
        <span className="input-group-text">
          {nameValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>
      </div>

      <div className="col-9">
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


      <div className="col-md-3">
        <label htmlFor="policyStartDate" className="form-label">Başlangıç Tarihi</label>
        <Calendar
        minDate={startDate}
        maxDate={policyEndDate}
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
          minDate={endDate}
          onChange={(e) => setPolicyEndDate(e.value as Date)}
          showIcon
          disabled={loading}
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="plate" className="form-label">Plaka</label>
        <input
          type="text"
          className="form-control"
          id="plate"
          value={plate || ''}
          disabled={loading}
          onChange={(e) => setPlate(e.target.value)}
          style={getInputStyle(descriptionValid)}
        />
        <span className="input-group-text">
          {plateValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>
      </div>

      <div className="col-5">
        <div className="form-floating col-4">
          <select className="form-select" id="floatingSelect" disabled={loading} onChange={(e) => setPolicyType(e.target.value)}>
            <option value="">Seçiniz</option>
            <option value="Kadın">Kasko</option>
            <option value="Erkek">Trafik</option>
          </select>
          <label htmlFor="floatingSelect">Poliçe Türü Seçiniz</label>
        </div>
        </div>


<div className='col-12'>
</div>
      <div className="col-12">
      <Toast ref={toast} />
        <ConfirmPopup
          target={buttonEl.current || undefined}
          visible={visible}
          onHide={() => setVisible(false)}
          message="Poliçeyi güncellemek istediğinize emin misiniz?"
          icon="pi pi-exclamation-triangle"
          accept ={accept}
          reject={reject}
          acceptLabel='Evet'
          rejectLabel='Hayır'
        />

        <Button
          ref={buttonEl}
          label={loading ? 'Yükleniyor...' : 'Poliçe İçin Fiyat Al.'}
          type="submit"
          icon="pi pi-check"
          disabled={loading}

          data-bs-toggle="modal" data-bs-target="#staticBackdrop"

          onClick={handleConfirm}
        />
      </div>
      
    </form>
    </div>
  );
};

export default CreateCarPolicy;
