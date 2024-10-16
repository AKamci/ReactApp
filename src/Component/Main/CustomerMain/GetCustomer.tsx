import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetCustomer-Slice';
import { InputText } from "primereact/inputtext";
import { deleteCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/DeleteCustomer-Slice';
import { useNavigate } from 'react-router-dom';
import { CustomerDto } from '../../../infrastructure/dto/CustomerDto';
import { loadCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetAllCustomer-Slice';
import ApiState from '../../../infrastructure/Enums/ApiState';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GetCustomer = () => {


    const dispatch = useAppDispatch();
    const customerEntity = useAppSelector((state) => state.getCustomer.data);
    const state = useAppSelector((state) => state.getCustomer.state);
    const activeRequest = useAppSelector((state) => state.getCustomer.activeRequest);
    const errorMessage = useAppSelector((state) => state.getCustomer.errorMessage);
    const responseStatus = useAppSelector((state) => state.getCustomer.responseStatus);




    const [loading, setLoading] = useState<boolean>(false);
    const [tckn, setTckn] = useState<string>(''); 
    const toast = useRef<Toast>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRemoved, setIsRemoved] = useState(false);

    useEffect(() => {
        console.log("Customer Triggered");
        console.log(customerEntity);
        console.log(customerEntity.id);
        console.log(customerEntity.tckn);

    }, [customerEntity]);

    const load = async () => {

        if (tckn.length !== 11) {
            toast.current?.show({ 
                severity: 'warn', 
                summary: 'Uyarı', 
                detail: 'TCKN 11 haneli olmalıdır.', 
                life: 3000 
            });
            return;
        }

        setLoading(true);
        setIsRemoved(true);
        
        const response = await dispatch(getCustomers({ tckn }));

        const condition = response.meta.requestStatus;

        console.log(customerEntity);
        console.log(response.meta.requestStatus);

        if(responseStatus == 404 || condition === 'rejected')
            {
                console.log("404 Aldım")
                console.log(responseStatus)
                toast.current?.show({ 
                    severity: 'info', 
                    summary: 'Başarılı', 
                    detail: 'Müşteri Bulunamadı.', 
                    life: 2000 
                });
            }

    };


    const removeCustomer = async (tckn: string) => {
        try {
            const resultAction = await dispatch(deleteCustomers({ tckn }));
            console.log("İçeride")
            console.log(responseStatus)
            
            if (responseStatus == 200 ) {
                console.log("200 Aldım")
                console.log(responseStatus)
                toast.current?.show({ 
                    severity: 'info', 
                    summary: 'Başarılı', 
                    detail: 'Müşteri Başarıyla Silindi.', 
                    life: 2000 
                });

                setIsRemoved(true)

            } 
            
            else if(responseStatus == 404)
            {
                console.log("404 Aldım")
                console.log(responseStatus)
                toast.current?.show({ 
                    severity: 'info', 
                    summary: 'Başarılı', 
                    detail: 'Müşteri Bulunamadı.', 
                    life: 2000 
                });

               
            }
            
            else {
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Hata', 
                    detail: 'Müşteri silinemedi.', 
                    life: 2000 
                });
            }
        } catch (error) {
            console.error('Silme işlemi sırasında bir hata oluştu:', error);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Hata', 
                detail: 'Bir hata oluştu, lütfen tekrar deneyin.', 
                life: 2000 
            });
        }
    };

    const navigate = useNavigate();
    const updateCustomer = (customer: CustomerDto) => {
        
        const customerData = {
            customer
        };
   
        navigate('/customer/updateCustomer', { state: { customer: customerData } });


    };
;

   const dataToDisplay = Array.isArray(customerEntity) ? customerEntity : customerEntity ? [customerEntity] : [];

    return (
        <div key={refreshKey}>
            <Toast ref={toast} />
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
                                    <button className='btn btn-danger' onClick={() => removeCustomer(customer.tckn)}><FontAwesomeIcon icon={faTrash} /></button>
                                )}
                            </td>
                            <td>
                                {customerEntity.id > 0 && (
                                    <button className='btn btn-info' onClick={() => updateCustomer(customer)}><FontAwesomeIcon icon={faPen} /></button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GetCustomer;
