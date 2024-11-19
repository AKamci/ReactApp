import React, { useEffect, useRef, useState } from 'react';
import { Container, Table, Button, Form, Row, Col, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllHealthPolicyWeight } from '../../../infrastructure/Store/Slices/HealthPolicyWeightSlices/GetListHealthPolicyWeight-Slice';
import { HealthPolicyWeightDto } from '../../../infrastructure/dto/HealthPolicyWeightDto';
import { updateHealthPolicyWeight, resetResponseStatus } from '../../../infrastructure/Store/Slices/HealthPolicyWeightSlices/UpdateHealthPolicyWeight-Slice';
import { Toast } from 'primereact/toast';
import { deleteHealthPolicyWeight } from '../../../infrastructure/Store/Slices/HealthPolicyWeightSlices/DeleteHealthPolicyWeight-Slice';
import { Chart } from 'primereact/chart';
import HealthPolicySamples from '../../../infrastructure/Helpers/HealthPolicyData';
import { getPersonalHealthWithCustomer } from '../../../infrastructure/Store/Slices/PersonalHealthSlice/PersonalHealthGetWCustomer';
import HealthPolicyWeightType from '../../../infrastructure/Enums/HealthPolicyType';
import { getPlateWithCustomer } from '../../../infrastructure/Store/Slices/LicensePlateSlices/GetPlateWithCustomer-Slice';
import DataSamples from '../../../infrastructure/Helpers/WeightData';
import { CustomerDto } from '../../../infrastructure/dto/CustomerDto';
import { updateListHealthPolicyWeight } from '../../../infrastructure/Store/Slices/HealthPolicyWeightSlices/UpdateListHealthPolicyWeight-Slice';

interface EditableHealthPolicyWeightDto extends HealthPolicyWeightDto {
  isNew?: boolean;
  isUpdated?: boolean;
}

interface HealthPolicyInfo {
  Amount: number;
  alcoholConsumption: boolean;
  bloodType: string;
  bmi: number;
  createdAt: string | null;
  customer: {
    address: string;
    birthDay: string;
    email: string;
    gender: number;
    grade: number;
    id: number;
    name: string;
    password: string;
    phone: string;
    tckn: string;
  };
  hasDisability: boolean;
  hasPreviousSurgeries: boolean;
  height: number;
  id: number;
  isPregnant: boolean;
  smokeConsumption: boolean;
  weight: number;
}

const HealthPolicyWeight: React.FC = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const toastRef = useRef<Toast>(null);
  const dispatch = useAppDispatch();
  const weights = useAppSelector((state) => state.getListHealthPolicyWeight?.data || []);
  const [data, setData] = useState<EditableHealthPolicyWeightDto[]>([]);
  const [policyInfos, setPolicyInfos] = useState<{ [key: string]: HealthPolicyInfo }>({});

  useEffect(() => {
    dispatch(getAllHealthPolicyWeight());
    fetchPolicyData();
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(policyInfos).length > 0) {
      updateChartData();
    }
  }, [policyInfos]);

  const fetchPolicyData = async () => {
    console.log('fetchPolicyData başladı');
    const newPolicyInfos: { [key: string]: HealthPolicyInfo } = {};
    for (const sample of HealthPolicySamples) {
      try {
        const response = await dispatch(getPersonalHealthWithCustomer({
          tckn: sample.tckn,
          coverageCode: sample.coverageCode
        }));    
        if (response.payload && typeof response.payload === 'object') {
          const tcknInfo = response.payload as HealthPolicyInfo;
          newPolicyInfos[sample.tckn] = tcknInfo;
        }
      } catch (error) {
        console.error(`Poliçe verisi alınamadı: ${sample.tckn}`, error);
      }
    }
    setPolicyInfos(newPolicyInfos);
    console.log('fetchPolicyData tamamlandı', newPolicyInfos);
  };

  const updateChartData = () => {
    console.log('updateChartData başladı', policyInfos);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    
    const labels = HealthPolicySamples.map(sample => sample.tckn);
    const amountsData = labels.map(tckn => policyInfos[tckn]?.Amount || 0);

    const data = {
      labels: labels,
      datasets: [
        { 
          label: 'Poliçe Tutarı', 
          data: amountsData, 
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        }
      ]
    };
    setChartData(data);
    setChartOptions({
      scales: { 
        x: { ticks: { color: textColorSecondary } }, 
        y: { ticks: { color: textColorSecondary } } 
      },
      plugins: {
        legend: {
          labels: { color: textColorSecondary }
        }
      }
    });
    console.log('updateChartData tamamlandı', data);
  };

  useEffect(() => {
    if (weights) {
      const initialData = weights
        .map(item => ({ ...item, isNew: false, isUpdated: false }))
        .sort((a, b) => a.type.localeCompare(b.type));
      setData(initialData);
      console.log('Veriler yüklendi', initialData);
    }
  }, [weights]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
    const { name, value } = e.target;
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [name]: value, isUpdated: !item.isNew } : item
      )
    );
    console.log('Input değişti', { id, name, value });
  };

  useEffect(() => {   
    return () => {
        dispatch(resetResponseStatus()); 
    };
  }, [dispatch]);

  const validateData = () => {
    console.log('validateData başladı');
    let isValid = true;
    const keySet = new Set();
    let errorMessage = "";
  
    const updatedData = data.map(item => {
      let itemHasError = false;
  
      if (!item.key.trim() || item.weight === undefined || item.minValue === undefined || item.maxValue === undefined || !item.type) {
        itemHasError = true;
        errorMessage = "Tüm alanları doldurunuz.";
      }
  
      if (item.key.trim() && keySet.has(item.key.trim())) {
        itemHasError = true;
        errorMessage = "Key alanları aynı olamaz.";
      } else if (item.key.trim()) {
        keySet.add(item.key.trim());
      }
  
      if (item.type !== HealthPolicyWeightType.GENDER && item.type !== HealthPolicyWeightType.POLICY_TYPE && item.type !== HealthPolicyWeightType.BOOLEAN_TYPE) {
        if (item.minValue > item.maxValue) {
          console.log(item, "item Error")
          itemHasError = true;
          errorMessage = "Min değer, Max değerden büyük olamaz.";
        }
      }
  
      if (itemHasError) isValid = false;
      return { ...item, hasError: itemHasError };
    });
  
    setData(updatedData);
  
    if (!isValid) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Hata',
        detail: errorMessage,
        life: 2000
      });
    }
  
    console.log('validateData tamamlandı', isValid);
    return isValid;
  };
  
  const handleSave = async () => {
    console.log('handleSave başladı');
    if (!validateData()) return;

    const itemsToSave: HealthPolicyWeightDto[] = data.map(item => ({ ...item }));
    const response = await dispatch(updateListHealthPolicyWeight({ dto: itemsToSave }));
      
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Güncellendi', life: 2000 });
      setData(prevData => prevData.map(item => ({ ...item, isNew: false, isUpdated: false })));
      fetchPolicyData(); // Yeni verileri çek ve grafiği güncelle
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
    console.log('handleSave tamamlandı', response);
  };

  const handleDelete = async (id: number, key: string) => {
    console.log('handleDelete başladı', { id, key });
    setData(prevData => prevData.filter(item => item.id !== id));
    const response = await dispatch(deleteHealthPolicyWeight({ key: key }));
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Silindi', life: 2000 });
      fetchPolicyData(); // Yeni verileri çek ve grafiği güncelle
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
    console.log('handleDelete tamamlandı', response);
  };

  const handleAddRow = () => {
    console.log('handleAddRow başladı');
    const newId = data.length ? Math.max(...data.map(item => item.id)) + 1 : 1;
    const newKey = `new_key_${newId}`;
    const newRow: EditableHealthPolicyWeightDto = { id: newId, key: newKey, weight: 0, minValue: 0, maxValue: 0, type: '', isNew: true };
    setData([...data, newRow]);
    console.log('handleAddRow tamamlandı', newRow);
  };

  if (data.length === 0) {
    return <div>Yükleniyor...</div>;
  }

  const renderTooltip = (tckn: string) => (
    <Tooltip id={`tooltip-${tckn}`}>
      {policyInfos[tckn] ? (
        <>
          <strong>Poliçe Bilgileri:</strong><br />
          Tutar: {policyInfos[tckn].Amount}<br />
          <br />
          <strong>Müşteri Bilgileri:</strong><br />
          İsim: {policyInfos[tckn].customer.name}<br />
          Adres: {policyInfos[tckn].customer.address}<br />
          Telefon: {policyInfos[tckn].customer.phone}<br />
          Doğum Tarihi: {policyInfos[tckn].customer.birthDay}<br />
          <br />
          <strong>Sağlık Bilgileri:</strong><br />
          Boy: {policyInfos[tckn].height} cm<br />
          Kilo: {policyInfos[tckn].weight.toFixed(2)} kg<br />
          BMI: {policyInfos[tckn].bmi.toFixed(2)}<br />
          Kan Grubu: {policyInfos[tckn].bloodType}<br />
          Alkol Kullanımı: {policyInfos[tckn].alcoholConsumption ? 'Evet' : 'Hayır'}<br />
          Sigara Kullanımı: {policyInfos[tckn].smokeConsumption ? 'Evet' : 'Hayır'}<br />
          Hamilelik: {policyInfos[tckn].isPregnant ? 'Evet' : 'Hayır'}<br />
          Engellilik: {policyInfos[tckn].hasDisability ? 'Evet' : 'Hayır'}<br />
          Geçmiş Ameliyatlar: {policyInfos[tckn].hasPreviousSurgeries ? 'Evet' : 'Hayır'}<br />
        </>
      ) : (
        'Bilgi yükleniyor...'
      )}
    </Tooltip>
  );

  return (
    <div>
      <Container className="mt-5">
        <Toast ref={toastRef} />
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>Key</th>
              <th>Weight</th>
              <th>Min Value</th>
              <th>Max Value</th>
              <th>Type</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
          {data.map(item => (
  <tr key={item.id} className={item.isNew ? 'table-warning' : ''}>
    <td>
      <Form.Control
        type="text"
        name="key"
        value={item.key}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        placeholder="Key girin"
      />
    </td>
    <td>
      <Form.Control
        type="number"
        name="weight"
        value={item.weight}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        placeholder="Ağırlık girin"
      />
    </td>
    <td>
      {![HealthPolicyWeightType.POLICY_TYPE, HealthPolicyWeightType.GENDER, HealthPolicyWeightType.BLOODTYPE, HealthPolicyWeightType.BOOLEAN_TYPE].includes(item.type as HealthPolicyWeightType) && (
        <Form.Control
          type="number"
          name="minValue"
          value={item.minValue}
          onChange={(e) => handleInputChange(e, item.id)}
          className="border-0"
        />
      )}
    </td>
    <td>
      {![HealthPolicyWeightType.POLICY_TYPE, HealthPolicyWeightType.GENDER, HealthPolicyWeightType.BLOODTYPE, HealthPolicyWeightType.BOOLEAN_TYPE].includes(item.type as HealthPolicyWeightType) && (
        <Form.Control
          type="number"
          name="maxValue"
          value={item.maxValue}
          onChange={(e) => handleInputChange(e, item.id)}
          className="border-0"
        />
      )}
    </td>
    <td>
      <Form.Select
        name="type"
        value={item.type}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        disabled={!item.isNew}
      >
        <option value="">Tür Seç</option>
        {Object.values(HealthPolicyWeightType)
          .filter(type => item.isNew ? type !== HealthPolicyWeightType.GENDER && type !== HealthPolicyWeightType.BLOODTYPE && type !== HealthPolicyWeightType.POLICY_TYPE && type !== HealthPolicyWeightType.BOOLEAN_TYPE : true )
          .map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
      </Form.Select>
    </td>
    <td className="text-center">
  {item.type !== HealthPolicyWeightType.GENDER && item.type !== HealthPolicyWeightType.BLOODTYPE && item.type !== HealthPolicyWeightType.POLICY_TYPE && item.type !== HealthPolicyWeightType.BOOLEAN_TYPE && (
    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.key)}>Sil</Button>
              )}
            </td>
          </tr>
        ))}

          </tbody>
        </Table>
        <div className="text-end mt-3">
          <Button variant="primary" onClick={handleAddRow} className="me-2">Yeni Bir Parametre Ekle</Button>
          <Button variant="success" onClick={handleSave}>Kaydet</Button>
        </div>
        <div className="mt-5">
          <Card>
            <Card.Body>
              <Chart type="line" data={chartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </div>
        <Row className="mt-3">
          <Col>
            <h4>TCKN Bilgileri</h4>
            <Row xs={1} md={2} lg={3} className="g-4">
              {Object.keys(policyInfos).map(tckn => (
                <Col key={tckn}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{tckn}</Card.Title>
                      <Card.Text>
                        Poliçe Tutarı: {policyInfos[tckn].Amount} TL
                      </Card.Text>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(tckn)}
                      >
                        <Button variant="outline-info" size="sm">Detaylar</Button>
                      </OverlayTrigger>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HealthPolicyWeight;
