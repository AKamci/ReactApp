import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/GetCarPolicy-Slice';
import { InputText } from "primereact/inputtext";
import { deleteCarPolicy } from '../../../infrastructure/Store/Slices/CarPolicySlices/DeleteCarPolicy-Slice';
import { useNavigate } from 'react-router-dom';
import { CarPolicyDto } from '../../../infrastructure/dto/CarPolicyDto';
import { Toast } from 'primereact/toast';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const GetCarPolicy = () => {
    const dispatch = useAppDispatch();
    const carPolicyEntity = useAppSelector((state) => state.getCarPolicy.data);
    const responseStatus = useAppSelector((state) => state.getCarPolicy.responseStatus);
    const [loading, setLoading] = useState<boolean>(false);
    const [id, setId] = useState<number>(0); 
    const toastRef = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Car Policy Triggered");
        console.log(carPolicyEntity);
        console.log(carPolicyEntity.tckn);

    }, [carPolicyEntity]);

    const load = async () => {
        console.log(id)
        setLoading(true);
        const response = await dispatch(getCarPolicy({ id }));
        const condition = response.meta.requestStatus;

        if (responseStatus === 404 || condition === 'rejected') {
            toastRef.current?.show({ 
                severity: 'info', 
                summary: 'Info', 
                detail: 'Car Policy Not Found.', 
                life: 2000 
            });
        }
    };

    const removeCarPolicy = async (id: number) => {
        try {
            const resultAction = await dispatch(deleteCarPolicy({ id }));
            if (responseStatus === 200) {
                toastRef.current?.show({ 
                    severity: 'info', 
                    summary: 'Success', 
                    detail: 'Car Policy Deleted Successfully.', 
                    life: 2000 
                });
            } else if (responseStatus === 404) {
                toastRef.current?.show({ 
                    severity: 'info', 
                    summary: 'Info', 
                    detail: 'Car Policy Not Found.', 
                    life: 2000 
                });
            } else {
                toastRef.current?.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to delete the car policy.', 
                    life: 2000 
                });
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            toastRef.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'An error occurred, please try again.', 
                life: 2000 
            });
        }
    };

    const updateCarPolicy = (carPolicy: CarPolicyDto) => {
        const carPolicyData = {
            carPolicy
        };
        navigate('/carPolicy/updateCarPolicy', { state: { carPolicy: carPolicyData } });
    };

    const dataToDisplay = Array.isArray(carPolicyEntity) ? carPolicyEntity : carPolicyEntity ? [carPolicyEntity] : [];

    return (
        <div>
            <Toast ref={toastRef} />
            <h3>POLİÇE NUMARASINI GİRİNİZ</h3>
            <div className="card flex justify-content-center">
                <InputText 
                    keyfilter="int" 
                    placeholder="POLİÇE NUMARASI GİRİNİZ" 
                    value={id} 
                    onChange={(e) => setId(e.target.value)}
                />
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3">
                <button type="button" className="btn btn-primary" onClick={load}> ARAMA </button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Policy Name</th>
                        <th scope="col">Policy Description</th>
                        <th scope="col">Policy Type</th>
                        <th scope="col">Status</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">License Plate</th>
                        <th scope="col">TCKN</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {dataToDisplay.map((carPolicy) => (
                        <tr key={`${carPolicy.id}`}>
                            <td>{carPolicy.tckn === undefined ? '' : carPolicy.id}</td>
                            <td>{carPolicy.policyName}</td>
                            <td>{carPolicy.policyDescription}</td>
                            <td>{carPolicy.policyType}</td>
                            <td>{carPolicy.tckn === undefined ? '' :carPolicy.policyStatus ? 'Active' : 'Inactive'}</td>
                            <td>{carPolicy.policyStartDate ? new Date(carPolicy.policyStartDate).toLocaleDateString() : ''}</td>
                            <td>{carPolicy.policyEndDate ? new Date(carPolicy.policyEndDate).toLocaleDateString() : ''}</td>
                            <td>{carPolicy.policyAmount}</td>
                            <td>{carPolicy.licensePlateNumber}</td>
                            <td>{carPolicy.tckn}</td>
                            <td>
                                {carPolicyEntity.policyAmount > 0 && (
                                    <button className='btn btn-danger' onClick={() => removeCarPolicy(carPolicy.id)}><FontAwesomeIcon icon={faTrash} /></button>
                                )}
                            </td>
                            <td>
                                {carPolicyEntity.policyAmount > 0 && (
                                    <button className='btn btn-info' onClick={() => updateCarPolicy(carPolicy)}><FontAwesomeIcon icon={faPen} /></button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetCarPolicy;
