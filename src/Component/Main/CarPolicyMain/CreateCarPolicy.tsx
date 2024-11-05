import { useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { updateCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/UpdateCarPolicy-Slice';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { createCarPolicy, resetResponseStatus } from '../../../infrastructure/Store/Slices/CarPolicySlices/CreateCarPolicy-Slice';
import { getPlateWithCustomer } from '../../../infrastructure/Store/Slices/LicensePlateSlices/GetPlateWithCustomer-Slice';

const CreateCarPolicy = () => {
  const dispatch = useAppDispatch();
  const carPolicy = useAppSelector((state) => state.createCarPolicy.data);
  const responseStatus = useAppSelector((state) => state.createCarPolicy.responseStatus);



  const carPolicyInformation = useAppSelector((state) => state.getPlateWithCustomer.data);

  const [policyStatus, setPolicyStatus] = useState(false);
  const [savedPolicy, setSavedPolicy] = useState(false);

  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef(null);
  const [policyName, setPolicyName] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');
  const [plate, setPlate] = useState('');
  const [policyType, setPolicyType] = useState<number | null>(null);
  const [policyStartDate, setPolicyStartDate] = useState<Date | null>(null);
  const [policyEndDate, setPolicyEndDate] = useState<Date | null>(null);
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);
  const navigate = useNavigate();
  const [nameValid, setNameValid] = useState<boolean>(false);
  const [descriptionValid, setDescriptionValid] = useState<boolean>(false);
  const [plateValid, setPlateValid] = useState<boolean>(false);


  useEffect(() => {
    if (carPolicyInformation) {
      console.log("Veri alındı, şimdi başka işlemler yapabilirsiniz.");
      console.log(carPolicyInformation);
    }
  }, [carPolicyInformation]);

  const validateForm = () => {
    if (!policyDescription || !policyType || !policyStartDate || !policyEndDate || !plate) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
      return false;
    }

    if (!descriptionValid || !plateValid) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Geçersiz kullanım.', life: 3000 });
      return false;
    }

    return true;
  };

  const accept = async () => {
    console.log(shouldOpenModal);
    setShouldOpenModal(true);
    console.log(policyStartDate);
    console.log(policyEndDate);

  
    try {
      
      const response = await dispatch(getPlateWithCustomer({
        plate,
        policyType,
      })).unwrap()
  
      if (response && response.car) {
        const waitForCarPolicyInformation = new Promise((resolve) => {
          const checkInformation = setInterval(() => {
            if (carPolicyInformation) {
              clearInterval(checkInformation);
              resolve(carPolicyInformation);
            }
          }, 100);
        });
  
        await waitForCarPolicyInformation;
        while(!response)
        {
          waitForCarPolicyInformation
        }
        console.log("Veri alındı, şimdi başka işlemler yapabilirsiniz.");
        console.log(carPolicyInformation);
      }
    } catch (error) {
      if (error.status === 404) {
        toast.current?.show({ severity: 'error', summary: 'Uyarı', detail: 'Plaka bulunamadı.', life: 3000 });
        setShouldOpenModal(false); 
      } else {
        toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Bir hata oluştu.', life: 3000 });
        setShouldOpenModal(false);
      }
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (policyStartDate) {
      const endDate = new Date(policyStartDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      setPolicyEndDate(endDate);
    }
  }, [policyStartDate]);


  useEffect(() => {
    if (responseStatus === 200 || responseStatus === 201) {
      toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Poliçe başarıyla oluşturuldu.', life: 2000 });
      setShouldOpenModal(false);
      dispatch(resetResponseStatus()); 
    } else if (responseStatus) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Poliçe oluşturulurken bir hata oluştu. Lütfen Tekrar Deneyiniz', life: 2000 });
      dispatch(resetResponseStatus()); 
    }
  }, [responseStatus]);
  const handleConfirmPolicy = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(carPolicyInformation);
  
    console.log("Policy Status:", policyStatus);
    console.log("Saved Policy:", savedPolicy);
  
    if (policyStatus || savedPolicy) {
      await dispatch(createCarPolicy({
        dto: {
          policyDescription,
          policyType,
          policyStatus: policyStatus || savedPolicy,
          policyStartDate: policyStartDate ? policyStartDate.toISOString().split('T')[0] : null,
          policyEndDate: policyEndDate ? policyEndDate.toISOString().split('T')[0] : null,
          tckn: carPolicyInformation.customer?.tckn,
          policyAmount: carPolicyInformation?.amount,
          licensePlateNumber: carPolicyInformation?.plate,
          policyOfferDate: new Date().toISOString().split('T')[0],
        }
      }));
    } else {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen bir işlem yapınız..', life: 2000 });
      return;
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
    const regex = /^(0[1-9]|[1-7][0-9]|81)[A-Z]{1,3}[0-9]{4}$/;
    setPlateValid(regex.test(value))
    console.log(value)
    setPlate(value)

  }

  const getInputStyle = (isValid: boolean | undefined) => {
    if (isValid === undefined) return {};
    return { borderColor: isValid ? 'green' : 'red' };
  };


  const reject = () => {
    setShouldOpenModal(false)
    toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Poliçe oluşturmak için onay vermelisiniz.', life: 2000 });
  };

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+ 1);


  return (
    <div>

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
            <h5 className="modal-title" id="staticBackdropLabel">POLİÇE ANTLAŞMASI</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShouldOpenModal(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      ARAÇ BİLGİLERİ
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <p><strong>Motor:</strong> {carPolicyInformation?.car?.engine || ''}</p>
                      <p><strong>Marka:</strong> {carPolicyInformation?.car?.make || ''}</p>
                      <p><strong>Model:</strong> {carPolicyInformation?.car?.model || ''}</p>
                      <p><strong>Yıl:</strong> {carPolicyInformation?.car?.year || ''}</p>
                      <p><strong>Kilometre:</strong> {carPolicyInformation?.car?.kilometers || ''} KM</p>
                      <p><strong>Tahmini Değeri:</strong> {carPolicyInformation?.car?.price} TL</p>
                      <p><strong>Plaka:</strong> {carPolicyInformation?.plate}</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      MÜŞTERİ BİLGİLERİ
                    </button>
                  </h2>
                  <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingTwo"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <p><strong>Ad:</strong> {carPolicyInformation?.customer?.name}</p>
                      <p><strong>Cinsiyet:</strong> {carPolicyInformation?.customer?.gender}</p>
                      <p><strong>TCKN:</strong> {carPolicyInformation?.customer?.tckn}</p>
                      <p><strong>Adres:</strong> {carPolicyInformation?.customer?.address}</p>
                      <p><strong>Telefon:</strong> {carPolicyInformation?.customer?.phone}</p>
                      <p><strong>Mail Adresi:</strong> {carPolicyInformation?.customer?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseThree"
                      aria-expanded="false"
                      aria-controls="flush-collapseThree"
                    >
                      POLİÇE BİLGİLERİ
                    </button>
                  </h2>
                  <div
                    id="flush-collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingThree"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <p><strong>Poliçe Açıklaması:</strong> {policyDescription}</p>
                      <p><strong>Başlangıç Tarihi:</strong> {policyStartDate ? policyStartDate.toLocaleDateString() : 'Belirtilmemiş'}</p>
                      <p><strong>Bitiş Tarihi:</strong> {policyEndDate ? policyEndDate.toLocaleDateString() : 'Belirtilmemiş'}</p>
                      <p><strong>Poliçe Türü:</strong> {policyType}</p>
                      <p><strong>Poliçe Fiyatı:</strong> {carPolicyInformation.amount}</p>

                    </div>
                  </div>
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
                <p className="text-primary">
                  ONAY VERİLMESİ DURUMUNDA TEKLİF OTOMATİK KAYDEDİLECEKTİR.
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={() => setShouldOpenModal(false)}>Kapat</button>
            <button type="button" className="btn btn-success" onClick={handleConfirmPolicy}>Onaylıyorum</button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
      

      <div className="col-md-12">
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
        hideOnDateTimeSelect
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
          disabled
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
          onChange={(e) => {
            const valueWithoutSpaces = e.target.value.replace(/\s+/g, '');
            validatePlate(valueWithoutSpaces);
          }}
          style={getInputStyle(plateValid)}
        />
        <span className="input-group-text">
          {plateValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>
      </div>

      <label htmlFor="floatingSelect" className="form-label mb-1">Poliçe Türü Seçiniz</label>
      <div className="col-md-5">
        <div className="form-floating col-4">
          <select 
            className="form-select" 
            id="floatingSelect" 
            disabled={loading} 
            onChange={(e) => setPolicyType(parseInt(e.target.value) || "")} 
          >
            <option value="">Seçiniz</option>
            <option value="101">Kasko</option>
            <option value="102">Trafik</option>
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
          message="Poliçe fiyat almak istediğinize emin misiniz?"
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

          onClick={handleConfirm}
        />
      </div>
      
    </form>
    </div>
  );
};

export default CreateCarPolicy;
