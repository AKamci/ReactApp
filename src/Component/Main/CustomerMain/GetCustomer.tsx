import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getCustomers, resetCustomerState } from '../../../infrastructure/Store/Slices/CustomerSlices/GetCustomer-Slice';
import { InputText } from "primereact/inputtext";
import { deleteCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/DeleteCustomer-Slice';
import { useNavigate } from 'react-router-dom';
import { CustomerDto } from '../../../infrastructure/dto/CustomerDto';
import ApiState from '../../../infrastructure/Enums/ApiState';
import { toast as reactToast } from 'react-toastify'; // Renamed import to avoid conflict
import { Toast } from 'primereact/toast';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../Shared/Spinner';

const GetCustomer = () => {
    const dispatch = useAppDispatch();
    const customerEntity = useAppSelector((state) => state.getCustomer.data);
    const state = useAppSelector((state) => state.getCustomer.state);
    const errorMessage = useAppSelector((state) => state.getCustomer.errorMessage);
    const [loading, setLoading] = useState<boolean>(false);
    const [tckn, setTckn] = useState<string>(''); 
    const toastRef = useRef<Toast>(null); // Changed name to toastRef
    const navigate = useNavigate();


    useEffect(() => {
      
        
        return () => {
            dispatch(resetCustomerState()); 
        };
    }, [dispatch]);



    const load = async () => {
        if (tckn.length !== 11) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Uyarı',
                detail: 'TCKN 11 haneli olmalıdır.',
                life: 3000
            });
            return;
        }
    
        setLoading(true); 
        const response = await dispatch(getCustomers({ tckn }));
    
        if (response.meta.requestStatus === 'fulfilled') {
            toastRef.current?.show({
                severity: 'success',
                summary: 'Bilgi',
                detail: 'Müşteri Bulundu.',
                life: 2000
            });
        } else if (response.meta.requestStatus === 'rejected') {
            const error = response.payload;

            if (error && error.status === 404) {
                toastRef.current?.show({
                    severity: 'info',
                    summary: 'Bilgi',
                    detail: 'Müşteri Bulunamadı.',
                    life: 2000
                });
            } else {
                toastRef.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Sunucuya ulaşılamadı.',
                    life: 3000
                });
            }
        }
        setLoading(false); 
    };

    const removeCustomer = async (tckn: string) => {
        setLoading(true); 
        try {
            const resultAction = await dispatch(deleteCustomers({ tckn }));

            if (resultAction.meta.requestStatus === 'fulfilled') {
                toastRef.current?.show({
                    severity: 'info',
                    summary: 'Başarılı',
                    detail: 'Müşteri Başarıyla Silindi.',
                    life: 2000
                });
            } else if (resultAction.meta.requestStatus === 'rejected') {
                const error = resultAction.payload;

                if (error && error.status === 404) {
                    toastRef.current?.show({
                        severity: 'info',
                        summary: 'Bilgi',
                        detail: 'Müşteri Bulunamadı.',
                        life: 2000
                    });
                } else {
                    toastRef.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: 'Müşteri silinemedi.',
                        life: 2000
                    });
                }
            }
        } catch (error) {
            console.error('Silme işlemi sırasında bir hata oluştu:', error);
            toastRef.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu, lütfen tekrar deneyin.',
                life: 2000
            });
        } finally {
            setLoading(false); 
        }
    };

    const updateCustomer = (customer: CustomerDto) => {        
        const customerData = {
            customer
        };
        navigate('/customer/updateCustomer', { state: { customer: customerData } });
    };

    const dataToDisplay = Array.isArray(customerEntity) ? customerEntity : customerEntity ? [customerEntity] : [];

    return (
        <div>
            <Toast ref={toastRef} />
            <h3>MÜŞTERİ ARAMA İÇİN TCKN GİRİN</h3>
            <div className="card flex justify-content-center">
                <InputText 
                    keyfilter="int" 
                    placeholder="TCKN GİRİNİZ" 
                    value={tckn} 
                    onChange={(e) => setTckn(e.target.value)}
                />
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3">
                <button type="button" className="btn btn-primary" onClick={load}>ARAMA</button>
            </div>
            {loading ? (
                <div className="flex justify-content-center">
                    <Spinner color='primary' />
                </div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">İsim</th>
                            <th scope="col">TCKN</th>
                            <th scope="col">Adres</th>
                            <th scope="col">Doğum Tarihi</th>
                            <th scope="col">Cinsiyet</th>
                            <th scope="col">Email</th>
                            <th scope="col">Telefon</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToDisplay.map((customer) => (
                            <tr key={`${customer.id}`}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.id === undefined ? '' : customer.tckn}</td>     
                                <td>{customer.address}</td>
                                <td>{customer.birthDay ? new Date(customer.birthDay).toLocaleDateString() : ''}</td>
                                <td>{customer.gender}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>
                                    {customerEntity.id > 0 && (
                                        <button className='btn btn-danger' onClick={() => removeCustomer(customer.tckn)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {customerEntity.id > 0 && (
                                        <button className='btn btn-info' onClick={() => updateCustomer(customer)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GetCustomer;
