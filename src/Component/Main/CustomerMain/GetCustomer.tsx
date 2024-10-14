import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/GetCustomer-Slice';
import { InputText } from "primereact/inputtext";
import { deleteCustomers } from '../../../infrastructure/Store/Slices/CustomerSlices/DeleteCustomer-Slice';

const GetCustomer = () => {
    const dispatch = useAppDispatch();
    const customerEntity = useAppSelector((state) => state.getCustomer.data);
    const [loading, setLoading] = useState<boolean>(false);
    const [tckn, setTckn] = useState<string>(''); 

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
;

    const dataToDisplay = Array.isArray(customerEntity) ? customerEntity : customerEntity ? [customerEntity] : [];

    return (
        <div>
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
                                    <button className='btn btn-danger' onClick={() => removeCustomer()}>Sil</button>
                                )}
                            </td>
                            <td>
                                {customerEntity.id > 0 && (
                                    <button className='btn btn-info' onClick={() => updateCustomer()}>Güncelle</button>
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
