import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import React, { useEffect, useState, useRef } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { getPersonalHealthWithCustomer } from '../../../infrastructure/Store/Slices/PersonalHealthSlice/PersonalHealthGetWCustomer';
import { createPersonalHealth } from '../../../infrastructure/Store/Slices/PersonalHealthSlice/CreatePersonalHealth';
import { useAppSelector } from '../../../infrastructure/Store/store';
import { HealthPolicyDto } from '../../../infrastructure/dto/HealthPolicyDto';
import { createHealthPolicy } from '../../../infrastructure/Store/Slices/HealthPolicySlices/CreateHealthPolicy';

const CreateHealthPolicy = () => {
  const dispatch = useDispatch();
  const healthData = useAppSelector((state) => state.getPersonalHealthWithCustomer.data);

  const [tckn, setTckn] = useState('');
  const [tcknValid, setTcknValid] = useState(false);
  const [policyStartDate, setPolicyStartDate] = useState<Date | null>(null);
  const [policyEndDate, setPolicyEndDate] = useState<Date | null>(null);
  const [policyType, setPolicyType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState(false);
  const [smokeConsumption, setSmokeConsumption] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [hasPreviousSurgeries, setHasPreviousSurgeries] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef<HTMLButtonElement>(null);

  const validateTckn = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length === 11) {
      let oddSum = 0;
      let evenSum = 0;
      for (let i = 0; i < 9; i++) {
        if (i % 2 === 0) {
          oddSum += parseInt(numericValue[i]);
        } else {
          evenSum += parseInt(numericValue[i]);
        }
      }
      const tenthDigit = (oddSum * 7 - evenSum) % 10;
      const eleventhDigit = (oddSum + evenSum + parseInt(numericValue[9])) % 10;
      
      if (tenthDigit === parseInt(numericValue[9]) && eleventhDigit === parseInt(numericValue[10])) {
        setTcknValid(true);
      } else {
        setTcknValid(false);
      }
    } else {
      setTcknValid(false);
    }
    setTckn(numericValue);
  };

  const getInputStyle = (isValid: boolean) => {
    return { borderColor: isValid ? 'green' : 'red' };
  };
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+ 1);
  useEffect(() => {
    if (policyStartDate) {
      const endDate = new Date(policyStartDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      setPolicyEndDate(endDate);
    }
  }, [policyStartDate]);

  const handleConfirm = () => {
    if (!tcknValid || !policyStartDate || !policyEndDate || !policyType) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Lütfen tüm alanları geçerli bir şekilde doldurunuz.', life: 3000 });
      return;
    }
    setVisible(true);
  };

  const resetHealthForm = () => {
    setHeight('');
    setWeight('');
    setBloodType('');
    setAlcoholConsumption(false);
    setSmokeConsumption(false);
    setIsPregnant(false);
    setHasDisability(false);
    setHasPreviousSurgeries(false);
  };

  const accept = async () => {
    setLoading(true);
    setShowHealthForm(false);
    resetHealthForm();
    try {
      const result = await dispatch(getPersonalHealthWithCustomer({
        tckn: tckn,
        coverageCode: parseInt(policyType)
      }));
      console.log(result, "result");
      if (getPersonalHealthWithCustomer.fulfilled.match(result)) {
        toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Poliçe bilgileri alındı.', life: 3000 });
        
        console.log(healthData, "healthData");
        if (healthData) {
          const policyData = {
            coverageCode: parseInt(policyType),
            personalHealthId: healthData.id,
            policyStartDate: policyStartDate ? policyStartDate.toISOString().split('T')[0] : null,
            policyEndDate: policyEndDate ? policyEndDate.toISOString().split('T')[0] : null,
            policyOfferDate: new Date().toISOString().split('T')[0],
            tckn: tckn,
            policyAmount: result.payload.Amount
          };
          console.log(policyData, "policyData");
          
          const createResult = await dispatch(createHealthPolicy({ dto: policyData }));
          
          if (createHealthPolicy.fulfilled.match(createResult)) {
            toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Sağlık poliçesi başarıyla oluşturuldu.', life: 3000 });
            setPolicyAmount(result.payload.Amount);
            setShouldOpenModal(true);
          } else {
            toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sağlık poliçesi oluşturulamadı.', life: 3000 });
          }
        }
      } else {
        const error = result.payload as { status?: number };
        if (error.status === 403) {
          setShowHealthForm(true);
          toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: '6 Ay dan daha önce oluşturulmuş bir sağlık beyanı bulunamadı', life: 3000 });
          toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen Yeni Bir Beyan Doldurunuz.', life: 3000 });
        } else {
          toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Poliçe bilgileri alınamadı.', life: 3000 });
        }
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Bir hata oluştu.', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const reject = () => {
    setShowHealthForm(false);
    resetHealthForm();
  };
  const handleHealthFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const healthFormData = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bloodType,
        coverageCode: parseInt(policyType),
        alcoholConsumption,
        smokeConsumption,
        isPregnant,
        hasDisability,
        hasPreviousSurgeries,
        tckn: tckn,
        bmi: parseFloat(weight)*10000 / (parseFloat(height) * parseFloat(height))
      };

      const result = await dispatch(createPersonalHealth({ dto: healthFormData }));

      if (createPersonalHealth.fulfilled.match(result)) {
        toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Sağlık bilgileri başarıyla kaydedildi.', life: 3000 });
        setShowHealthForm(false);
        resetHealthForm();
      } else {
        toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sağlık bilgileri kaydedilemedi.', life: 3000 });
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Bir hata oluştu.', life: 3000 });
    }
  };

  return (
    <div>
       <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
       <div className="col-3">
        <label htmlFor="inputTckn" className="form-label">TCKN</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="inputTckn"
            disabled={loading}
            value={tckn}
            onChange={(e) => validateTckn(e.target.value)}
            style={getInputStyle(tcknValid)}
          />
          <span className="input-group-text">
            {tcknValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
          </span>
        </div>
      </div>
      <div className="col-9">
      </div>

        <div className="col-md-3">
          <label htmlFor="policyStartDate" className="form-label">Başlangıç Tarihi</label>
          <Calendar
          minDate={startDate}
          maxDate={policyEndDate || undefined}
          hideOnDateTimeSelect
          value={policyStartDate}
            onChange={(e) => setPolicyStartDate(e.value)}
            showIcon
            disabled={loading}
            dateFormat="dd/mm/yy"
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="policyEndDate" className="form-label">Bitiş Tarihi</label>
          <Calendar
            value={policyEndDate}
            minDate={endDate}
            onChange={(e) => setPolicyEndDate(e.value)}
            showIcon
            disabled
            dateFormat="dd/mm/yy"
          />
        </div>

        <label htmlFor="floatingSelect" className="form-label mb-1">Poliçe Türü Seçiniz</label>
        <div className="col-md-5">
          <div className="form-floating col-4">
            <select 
              className="form-select" 
              id="floatingSelect" 
              disabled={loading} 
              onChange={(e) => setPolicyType(e.target.value)} 
              value={policyType}
            >
              <option value="">Seçiniz</option>
              <option value="105">Ayakta Tedavi</option>
              <option value="106">Yatarak Tedavi</option>
              <option value="107">Seyahat</option>
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
            type="button"
            icon="pi pi-check"
            disabled={loading}
            onClick={handleConfirm}
          />
        </div>
      </form>

      {showHealthForm && (
        <form onSubmit={handleHealthFormSubmit} className="mt-4">
          <h3>Sağlık Bilgileri</h3>
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="height" className="form-label">Boy (cm)</label>
              <input type="number" className="form-control" id="height" value={height} onChange={(e) => setHeight(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label htmlFor="weight" className="form-label">Kilo (kg)</label>
              <input type="number" className="form-control" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label htmlFor="bloodType" className="form-label">Kan Grubu</label>
              <select className="form-select" id="bloodType" value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
                <option value="">Seçiniz</option>
                <option value="1">A+</option>
                <option value="2">A-</option>
                <option value="3">B+</option>
                <option value="4">B-</option>
                <option value="5">AB+</option>
                <option value="6">AB-</option>
                <option value="7">0+</option>
                <option value="8">0-</option>
              </select>
            </div>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="alcoholConsumption" checked={alcoholConsumption} onChange={(e) => setAlcoholConsumption(e.target.checked)} />
            <label className="form-check-label" htmlFor="alcoholConsumption">Alkol Kullanımı</label>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="smokeConsumption" checked={smokeConsumption} onChange={(e) => setSmokeConsumption(e.target.checked)} />
            <label className="form-check-label" htmlFor="smokeConsumption">Sigara Kullanımı</label>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="isPregnant" checked={isPregnant} onChange={(e) => setIsPregnant(e.target.checked)} />
            <label className="form-check-label" htmlFor="isPregnant">Hamilelik Durumu</label>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="hasDisability" checked={hasDisability} onChange={(e) => setHasDisability(e.target.checked)} />
            <label className="form-check-label" htmlFor="hasDisability">Engellilik Durumu</label>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="hasPreviousSurgeries" checked={hasPreviousSurgeries} onChange={(e) => setHasPreviousSurgeries(e.target.checked)} />
            <label className="form-check-label" htmlFor="hasPreviousSurgeries">Geçirilmiş Ameliyat</label>
          </div>
          <Button label="Sağlık Bilgilerini Kaydet" type="submit" icon="pi pi-check" />
        </form>
      )}

      {shouldOpenModal && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel"></h5>
                <p className="text-primary">
                  <strong>POLİÇE TEKLİFİNİZ ALINDI </strong>   
                  <br />   
                  <strong>POLİÇE DETAYLARI AŞAĞIDADIR</strong>      
                </p>
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
                          SAĞLIK BİLGİLERİ
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <p><strong>Boy:</strong> {healthData?.height} cm</p>
                          <p><strong>Kilo:</strong> {Math.round(healthData?.weight)} kg</p>
                          <p><strong>BMI:</strong> {Math.round(healthData?.bmi)}</p>
                          <p><strong>Kan Grubu:</strong> {healthData?.bloodType}</p>
                          <p><strong>Alkol Kullanımı:</strong> {healthData?.alcoholConsumption ? 'Evet' : 'Hayır'}</p>
                          <p><strong>Sigara Kullanımı:</strong> {healthData?.smokeConsumption ? 'Evet' : 'Hayır'}</p>
                          <p><strong>Hamilelik Durumu:</strong> {healthData?.isPregnant ? 'Evet' : 'Hayır'}</p>
                          <p><strong>Engellilik Durumu:</strong> {healthData?.hasDisability ? 'Evet' : 'Hayır'}</p>
                          <p><strong>Geçirilmiş Ameliyat:</strong> {hasPreviousSurgeries ? 'Evet' : 'Hayır'}</p>
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
                        <p><strong>Ad:</strong> {healthData?.customer?.name}</p>
                          <p><strong>Cinsiyet:</strong> {healthData?.customer?.gender === 0 ? "Kadın" : "Erkek"}</p>
                          <p><strong>TCKN:</strong> {healthData?.customer?.tckn}</p>
                          <p><strong>Adres:</strong> {healthData?.customer?.address}</p>
                          <p><strong>Telefon:</strong> {healthData?.customer?.phone}</p>
                          <p><strong>Mail Adresi:</strong> {healthData?.customer?.email}</p>
                          
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingFour">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseFour"
                          aria-expanded="false"
                          aria-controls="flush-collapseFour"
                        >
                          POLİÇE BİLGİLERİ
                        </button>
                      </h2>
                      <div
                        id="flush-collapseFour"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingFour"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <p><strong>Başlangıç Tarihi:</strong> {policyStartDate ? policyStartDate.toLocaleDateString() : 'Belirtilmemiş'}</p>
                          <p><strong>Bitiş Tarihi:</strong> {policyEndDate ? policyEndDate.toLocaleDateString() : 'Belirtilmemiş'}</p>
                          <p><strong>Poliçe Türü:</strong> {policyType === '105' ? 'Ayakta Tedavi' : policyType === '106' ? 'Yatarak Tedavi' : 'Seyahat'}</p>
                          <p><strong>Poliçe Fiyatı:</strong> {policyAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => setShouldOpenModal(false)}>Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateHealthPolicy