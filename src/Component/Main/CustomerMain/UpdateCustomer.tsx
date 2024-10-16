import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { createCustomer } from '../../../infrastructure/Store/Slices/CustomerSlices/CreateCustomer-Slice';
import ApiState from '../../../infrastructure/Enums/ApiState';
import { updateCustomer } from '../../../infrastructure/Store/Slices/CustomerSlices/UpdateCustomer-Slice';

const UpdateCustomer = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.updateCustomer.state);
  const customer = useAppSelector((state) => state.updateCustomer.data);
  const activeCustomer = useAppSelector((state) => state.updateCustomer.activeRequest);

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

  const location = useLocation();
  const customerData = location.state?.customer.customer;

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
  }, [customerData]);

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); 
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const validateForm = () => {
    if (tckn.length !== 11) { 
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'TCKN 11 haneli olmalıdır.', life: 3000 });
      return false;
    }
    if (!name || !phone || !email || !address || !gender || !birthDate) {
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanlar doldurulmalıdır.', life: 3000 });
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
  
    if (false) { 
      toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Girilen TCKN zaten mevcuttur.', life: 2000 });
    } else {
      setLoading(true)
      await toast.current?.show({ severity: 'info', summary: 'Mesaj', detail: 'Müşteri Başarıyla Güncellendi.', life: 2000 });
      
      setTimeout(() => {
        setLoading(false)
        navigate('/customer/customerList');
      }, 2000); 
      

    }
  };

  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Hata', detail: 'Müşteri güncellemek için onay vermelisiniz.', life: 2000 });
  };

  const handleConfirm = (e: React.MouseEvent) => {
    console.log()
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
          disabled ={loading} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="inputPhone" className="form-label">Telefon</label>
        <input 
          type="text" 
          className="form-control" 
          id="inputPhone" 
          value={phone}
          disabled ={loading} 
          onChange={(e) => setPhone(e.target.value)} 
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="inputEmail" className="form-label">E-Mail</label>
        <input 
          type="email" 
          className="form-control" 
          id="inputEmail" 
          disabled ={loading}
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="col-12">
        <label htmlFor="inputAddress" className="form-label">Adres</label>
        <input 
          type="text" 
          className="form-control" 
          disabled ={loading}
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
            disabled ={loading}
          >
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
            <Button ref={buttonEl} onClick={handleConfirm} disabled ={loading} icon="pi pi-check" label={loading ? 'Yönlendiriliyor...' : 'Onayla'} />
          </div>
        </>
      </div>
    </form>
  );
};

export default UpdateCustomer;
