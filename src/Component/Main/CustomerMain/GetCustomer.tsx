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

const GetCustomer = () => {
    const dispatch = useAppDispatch();
    const customerEntity = useAppSelector((state) => state.getCustomer.data);
    const activeCustomer = useAppSelector((state) => state.customers.activeRequest);
    const [loading, setLoading] = useState<boolean>(false);
    const [tckn, setTckn] = useState<string>(''); 
    const toast = useRef<Toast>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        console.log("Customer Triggered");
        console.log(customerEntity);
    }, [customerEntity]);

    const load = () => {
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        dispatch(getCustomers({ tckn }));
        console.log(customerEntity);
    };


    const removeCustomer = async (tckn: string) => {
        console.log("tckn")
        console.log(tckn)
        await dispatch(deleteCustomers({ tckn }))
        toast.current?.show({ severity: 'info', summary: 'Mesaj', detail: 'Müşteri Başarıyla Silindi.', life: 2000 });
        setRefreshKey((oldKey) => oldKey + 1);
        
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
                        <th scope="col">Yaş</th>
                        <th scope="col">Cinsiyet</th>
                        <th scope="col">Email</th>
                        <th scope="col">Telefon</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {dataToDisplay.map((customer) => (
                        <tr key={`${customer.id}-${customer.tckn}`}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.tckn}</td>
                            <td>{customer.address}</td>
                            <td>{customer.age}</td>
                            <td>{customer.gender}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>
                                {customerEntity.id > 0 && (
                                    <button className='btn btn-danger' onClick={() => removeCustomer(customer.tckn)}>Sil</button>
                                )}
                            </td>
                            <td>
                                {customerEntity.id > 0 && (
                                    <button className='btn btn-info' onClick={() => updateCustomer(customer)}>Güncelle</button>
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
