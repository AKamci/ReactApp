import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { createCustomer } from '../../../infrastructure/Store/Slices/CustomerSlices/CreateCustomer-Slice';
import ApiState from '../../../infrastructure/Enums/ApiState';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const CreateCustomer = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.createCustomer.state);
  const customer = useAppSelector((state) => state.createCustomer.data);
  const activeCustomer = useAppSelector((state) => state.createCustomer.activeRequest);
  const errorMessage = useAppSelector((state) => state.createCustomer.errorMessage);
  const responseStatus = useAppSelector((state) => state.createCustomer.responseStatus);

  const [visible, setVisible] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [tckn, setTckn] = useState('');
  const [tcknValid, setTcknValid] = useState<boolean>(false);
  
  const [nameValid, setNameValid] = useState<boolean>(false);
  const [phoneValid, setPhoneValid] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const validateTckn = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length === 11) {
      setTcknValid(true);
    } else {
      setTcknValid(false);
    }
    setTckn(numericValue);
  };

  const validateName = (value: string) => {
    if (value.length > 255) {
      setNameValid(false); 
      return; 
    }
    const regex = /^[A-Za-zğüşıöçĞÜŞİÖÇ\s]*$/; 
    if (!regex.test(value)) {
      const cleanedValue = value.replace(/[^A-Za-zğüşıöçĞÜŞİÖÇ\s]/g, ''); 
      setName(cleanedValue); 
      setNameValid(cleanedValue.trim() !== ''); 
    } else {
      setName(value);
      setNameValid(value.trim() !== '');
    }
  };
  
  
  const validatePhone = (value: string) => {
    const regex = /^\d{10}$/; 
    setPhoneValid(regex.test(value));
    setPhone(value);
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    setEmailValid(regex.test(value));
    setEmail(value);
  };

  const validateForm = () => {
    if (!tcknValid) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'TCKN 11 haneli olmalıdır.', life: 3000 });
      return false;
    }
    if (!nameValid || !phoneValid || !emailValid || !address || !gender || !birthDate) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır ve geçerli olmalıdır.', life: 3000 });
      return false;
    }
    return true;
  };

  const accept = async () => {
    const formData = {
      tckn: tckn,
      name: name,
      phone: phone,
      email: email,
      address: address,
      birthDay: birthDate ? birthDate.toISOString().split('T')[0] : null,
      gender: gender,
    };

    dispatch(createCustomer({
      dto: {
        tckn: tckn,
        name: name,
        phone: phone,
        email: email,
        address: address,
        birthDay: birthDate ? birthDate.toISOString().split('T')[0] : null,
        gender: gender,
      }
    }));

    if (responseStatus === 409) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Girilen TCKN zaten mevcuttur.', life: 2000 });
    } else {
      setLoading(true);
      await toast.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Müşteri Başarıyla Oluşturuldu.', life: 2000 });

      setTimeout(() => {
        setLoading(false);
        navigate('/customer/customerList');
      }, 2000);
    }
  };

  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Müşteri oluşturmak için onay vermelisiniz.', life: 2000 });
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setVisible(true);
    }
  };

  const getInputStyle = (isValid: boolean | undefined) => {
    if (isValid === undefined) return {};
    return { borderColor: isValid ? 'green' : 'red' };
  };

  return (
    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
      <div className="col-md-2">
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
      <div className="col-md-3">
        <label htmlFor="inputName" className="form-label">İsim</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="inputName"
            disabled={loading}
            value={name}
            onChange={(e) => validateName(e.target.value)}
            style={getInputStyle(nameValid)}
          />
          <span className="input-group-text">
            {nameValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
          </span>
        </div>
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPhone" className="form-label">Telefon</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="inputPhone"
            disabled={loading}
            value={phone}
            onChange={(e) => validatePhone(e.target.value)}
            style={getInputStyle(phoneValid)}
          />
          <span className="input-group-text">
            {phoneValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
          </span>
        </div>
      </div>
      <div className="col-md-4">
        <label htmlFor="inputEmail" className="form-label">E-Mail</label>
        <div className="input-group">
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            disabled={loading}
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            style={getInputStyle(emailValid)}
          />
          <span className="input-group-text">
            {emailValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
          </span>
        </div>
      </div>

      <div className="col-12">
        <label htmlFor="inputAddress" className="form-label">Adres</label>
        <input type="text" className="form-control" id="inputAddress" disabled={loading} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="col-3">
        <label htmlFor="inputBirthDate" className="form-label">Doğum Tarihi</label>
        <Calendar 
          id="inputBirthDate"
          value={birthDate} 
          onChange={(e) => setBirthDate(e.value)} 
          dateFormat="dd-mm-yy"
          showIcon 
          disabled={loading}
          minDate={minDate} 
          maxDate={maxDate} 
        />
      </div>
      <div className="col-12">
        <div className="form-floating col-2 small">
          <select className="form-select" id="floatingSelect" value={gender} disabled={loading} onChange={(e) => setGender(e.target.value)}>
            <option value="">Seçiniz</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
          </select>
          <label htmlFor="floatingSelect">Cinsiyet Seç</label>
        </div>
        <div className="col-12">
          <br />
        </div>
        <>
          <Toast ref={toast} />
          <ConfirmPopup 
            target={buttonEl.current} 
            visible={visible} 
            onHide={() => setVisible(false)} 
            message="Müşteriyi oluşturmak üzeresiniz" 
            icon="pi pi-exclamation-triangle" 
            accept={accept} 
            reject={reject} 
            acceptLabel="Evet" 
            rejectLabel="Hayır" 
          />
          <Button ref={buttonEl} onClick={handleConfirm}  icon="pi pi-check" label={loading ? 'Yönlendiriliyor...' : 'Onayla'} />
        </>
      </div>
    </form>
  );
};

export default CreateCustomer;