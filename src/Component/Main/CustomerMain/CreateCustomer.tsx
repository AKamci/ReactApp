import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { createCustomer } from '../../../infrastructure/Store/Slices/CustomerSlices/CreateCustomer-Slice';
import ApiState from '../../../infrastructure/Enums/ApiState';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const customerData = location.state?.customer;

  
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); 
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const validateEmail = (email: string) => {
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook|live)\.(com|net|org|co|info|biz)$/;
    return emailRegex.test(email);
  };
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(05\d{9}|[0-9]{3}-[0-9]{3}-[0-9]{4})$/;
    return phoneRegex.test(phone);
};

  const validateForm = () => {
    if (tckn.length !== 11) { 
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'TCKN 11 haneli olmalıdır.', life: 3000 });
      return false;
    }
    if (!name || !phone || !email || !address || !gender || !birthDate) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
      return false;
    }
    if (!validateEmail(email)) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Geçersiz e-posta formatı.', life: 3000 });
      return false;
    }
    if(!validatePhone(phone))
    {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Geçersiz telefon formatı.', life: 3000 });
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
    console.log('State:', state);
    console.log('Customer:', customer);
    console.log('Active Customer:', activeCustomer);
    console.log('Error Message:', errorMessage);
    console.log('Response Status:', responseStatus);
      
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
      toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Girilen TCKN zaten mevcuttur.', life: 2000 });
    } else {
      setLoading(true);
      await toast.current?.show({ severity: 'info', summary: 'Mesaj', detail: 'Müşteri Başarıyla Oluşturuldu.', life: 2000 });
      
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

  return (
    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
      <div className="col-md-2">
        <label htmlFor="inputTckn" className="form-label">TCKN</label>
        <input
          type="text"
          className="form-control"
          id="inputTckn"
          disabled={loading}
          value={tckn} 
          onChange={(e) => setTckn(e.target.value)} 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputName" className="form-label">İsim</label>
        <input type="text" className="form-control" id="inputName" disabled={loading} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPhone" className="form-label">Telefon</label>
        <input type="text" className="form-control" id="inputPhone" disabled={loading} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="col-md-4">
        <label htmlFor="inputEmail" className="form-label">E-Mail</label>
        <input type="email" className="form-control" id="inputEmail" disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
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
          <div className="card flex justify-content-center col-2">
            <Button ref={buttonEl} onClick={handleConfirm} icon="pi pi-check" label={loading ? 'Yönlendiriliyor...' : 'Onayla'} />
          </div>
        </>
      </div>
    </form>
  );
};

export default CreateCustomer;
