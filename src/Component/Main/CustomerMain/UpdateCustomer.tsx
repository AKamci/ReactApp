import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { updateCustomer } from '../../../infrastructure/Store/Slices/CustomerSlices/UpdateCustomer-Slice';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const UpdateCustomer = () => {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.updateCustomer.data);
  const location = useLocation();
  const customerData = location.state?.customer.customer;

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const buttonEl = useRef(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [tckn, setTckn] = useState('');
  const navigate = useNavigate();


  const [nameValid, setNameValid] = useState<boolean>(false);
  const [phoneValid, setPhoneValid] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);

  useEffect(() => {
    if (customerData) {
      setName(customerData.name || '');
      setPhone(customerData.phone || '');
      setEmail(customerData.email || '');
      setAddress(customerData.address || '');
      setGender(customerData.gender || '');
      setTckn(customerData.tckn || '');
      setBirthDate(customerData.birthDay ? new Date(customerData.birthDay) : null);
    }

    validateName(customerData.name || '');
    validatePhone(customerData.phone || '');
    validateEmail(customerData.email || '');
  }, [customerData]);

  const validateForm = () => {
    if (tckn.length !== 11) { 
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'TCKN 11 haneli olmalıdır.', life: 3000 });
      return false;
    }
    if (!name || !phone || !email || !address || !gender || !birthDate) {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
      return false;
    }

    if (name === customerData.name && phone === customerData.phone && email === customerData.email &&
        address === customerData.address && gender === customerData.gender && 
        birthDate?.toISOString().split('T')[0] === new Date(customerData.birthDay).toISOString().split('T')[0]) {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Hiçbir değişiklik yapılmadı.', life: 3000 });
      return false;
    }
    if(!phoneValid || !emailValid || !nameValid)
    {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Geçersiz kullanım.', life: 3000 });
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
  
    console.log(JSON.stringify(formData, null, 2));
    console.log("DISPATCH UPDATE")
    
    dispatch(updateCustomer({
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
  
    setLoading(true);
    toast.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Müşteri Başarıyla Güncellendi.', life: 2000 });

    setTimeout(() => {
      setLoading(false);
      navigate('/customer/customerList');
    }, 2000); 
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
    setName(value);
  };

  const getInputStyle = (isValid: boolean | undefined) => {
    if (isValid === undefined) return {};
    return { borderColor: isValid ? 'green' : 'red' };
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    setEmailValid(regex.test(value));
    setEmail(value);
  };

  const validatePhone = (value: string) => {
    const regex = /^\d{10}$/; 
    setPhoneValid(regex.test(value));
    setPhone(value);
  };
  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Müşteri oluşturmak için onay vermelisiniz.', life: 2000 });
  };

  return (
    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
      <div className="col-md-2">
        <label htmlFor="inputTckn" className="form-label">TCKN</label>
        <input
          type="text"
          className="form-control"
          id="inputTckn"
          value={tckn}
          readOnly
          disabled 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputName" className="form-label">İsim</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputName" 
          value={name}
          disabled={loading} 
          onChange={(e) => validateName(e.target.value)}
          style={getInputStyle(nameValid)} 
        />
        <span className="input-group-text">
          {nameValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>      
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPhone" className="form-label">Telefon</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPhone" 
          value={phone}
          disabled={loading} 
          onChange={(e) => validatePhone(e.target.value)} 
          style={getInputStyle(nameValid)} 
        />
        <span className="input-group-text">
          {phoneValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>
      </div>
      <div className="col-md-4">
        <label htmlFor="inputEmail" className="form-label">E-Mail</label>
        <input 
          type="email" 
          className="form-control" 
          id="inputEmail" 
          disabled={loading}
          value={email} 
          onChange={(e) => validateEmail(e.target.value)} 
          style={getInputStyle(nameValid)} 
        />
        <span className="input-group-text">
          {emailValid ? <AiOutlineCheckCircle color="green" size={12} /> : <AiOutlineCloseCircle color="red" size={12} />}
        </span>
      </div>
      <div className="col-12">
        <label htmlFor="inputAddress" className="form-label">Adres</label>
        <input 
          type="text" 
          className="form-control" 
          disabled={loading}
          id="inputAddress" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="inputTckn" className="form-label">Doğum Tarihi</label>
        <input
          type="text"
          className="form-control"
          id="inputTckn"
          value={customerData.birthDay}
          readOnly
          disabled 
        />
      </div>

      <div className="col-12">
        <div className="form-floating col-2 small">
          <select 
            className="form-select" 
            id="floatingSelect" 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
            disabled={loading}
          >
            <option value="">Seçiniz</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
          </select>
          <label htmlFor="floatingSelect">Cinsiyet</label>
        </div>
      </div>
      
      <div className="col-12">
      <ConfirmPopup 
            target={buttonEl.current} 
            visible={visible} 
            onHide={() => setVisible(false)} 
            message="Müşteriyi Güncellemek Üzeresiniz" 
            icon="pi pi-exclamation-triangle" 
            accept={accept} 
            reject={reject} 
            acceptLabel="Evet" 
            rejectLabel="Hayır" 
          />
          <Button ref={buttonEl}  className="p-button-success" onClick={handleConfirm} icon="pi pi-check" label={loading ? 'Yönlendiriliyor...' : 'Güncelle'} />
        <Toast ref={toast} />
      </div>
    </form>
  );
};

export default UpdateCustomer;
