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
import { resetResponseStatus } from '../../../infrastructure/Store/Slices/CarPolicySlices/CreateCarPolicy-Slice';

const GetCustomer = () => {
    const dispatch = useAppDispatch();
    const [customerEntity, setCustomerEntity] = useState<CustomerDto | null>(null);
    const state = useAppSelector((state) => state.getCustomer.state);
    const errorMessage = useAppSelector((state) => state.getCustomer.errorMessage);
    const [loading, setLoading] = useState<boolean>(false);
    const [tckn, setTckn] = useState<string>(''); 
    const toastRef = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            dispatch(resetCustomerState());
            dispatch(resetResponseStatus());
        };
    }, [dispatch]);

    useEffect(() => {
        // Clear customer data when component mounts or when navigating to this page
        setCustomerEntity(null);
        setTckn('');
    }, []);

    const load = async () => {
        if (!(/^[1-9]\d{9}[02468]$/).test(tckn)) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Uyarı',
                detail: 'TCKN 11 haneli olmalıdır ve geçerli bir TCKN olmalıdır.',
                life: 3000
            });
            return;
        }

        setLoading(true); 
        const response = await dispatch(getCustomers({ tckn }));
    
        if (response.meta.requestStatus === 'fulfilled') {
            setCustomerEntity(response.payload as CustomerDto);
            toastRef.current?.show({
                severity: 'success',
                summary: 'Bilgi',
                detail: 'Müşteri Bulundu.',
                life: 2000
            });
        } else if (response.meta.requestStatus === 'rejected') {
            setCustomerEntity(null);
            const error = response.payload as { status?: number };

            if (error && error.status === 404) {
                toastRef.current?.show({
                    severity: 'warn',
                    summary: 'Uyarı',
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
                setCustomerEntity(null);
                setTckn('');
                toastRef.current?.show({
                    severity: 'success',
                    summary: 'Bilgi',
                    detail: 'Müşteri Başarıyla Silindi.',
                    life: 2000
                });
            } else if (resultAction.meta.requestStatus === 'rejected') {
                const error = resultAction.payload as { status?: number };

                if (error && error.status === 404) {
                    toastRef.current?.show({
                        severity: 'warn',
                        summary: 'Uyarı',
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
                customerEntity && (
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
                            <tr key={`${customerEntity.id}`}>
                                <td>{customerEntity.id}</td>
                                <td>{customerEntity.name}</td>
                                <td>{customerEntity.tckn}</td>     
                                <td>{customerEntity.address}</td>
                                <td>{customerEntity.birthDay ? new Date(customerEntity.birthDay).toLocaleDateString() : ''}</td>
                                <td>
                                {customerEntity.gender === 1 ? 'Erkek' : customerEntity.gender === 0 ? 'Kadın' : ''}
                                </td>
                                <td>{customerEntity.email}</td>
                                <td>{customerEntity.phone}</td>
                                <td>
                                    <button className='btn btn-danger' onClick={() => removeCustomer(customerEntity.tckn)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                                <td>
                                    <button className='btn btn-info' onClick={() => updateCustomer(customerEntity)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}

export default GetCustomer;
