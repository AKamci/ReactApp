import React, { useEffect, useRef, useState } from 'react';
import { Container, Table, Button, Form, Row, Col, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllWeight } from '../../../infrastructure/Store/Slices/WeightSlices/GetListWeight-Slice';
import { WeightDto } from '../../../infrastructure/dto/WeightDto';
import WeightsType from '../../../infrastructure/Enums/WeightsType';
import { updateListWeight, resetResponseStatus } from '../../../infrastructure/Store/Slices/WeightSlices/UpdateListWeight-Slice';
import { Toast } from 'primereact/toast';
import { deleteWeight } from '../../../infrastructure/Store/Slices/WeightSlices/DeleteWeight-Slice';
import { Chart } from 'primereact/chart';
import { getPlateWithCustomer } from '../../../infrastructure/Store/Slices/LicensePlateSlices/GetPlateWithCustomer-Slice';
import DataSamples from '../../../infrastructure/Helpers/WeightData';

interface EditableWeightDto extends WeightDto {
  isNew?: boolean;
  isUpdated?: boolean;
}

interface PlateInfo {
  amount: number;
  car: {
    engine: number;
    id: number;
    kilometers: number;
    make: string;
    model: string;
    price: number;
    type: number;
    year: number;
  };
  coverageCode: number;
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
  };
}

const CarPolicyWeight: React.FC = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const toastRef = useRef<Toast>(null);
  const dispatch = useAppDispatch();
  const weights = useAppSelector((state) => state.getListWeight.data);
  const [data, setData] = useState<EditableWeightDto[]>([]);
  const plateData = useAppSelector((state) => state.getPlateWithCustomer.data);
  const [policyAmounts, setPolicyAmounts] = useState<{ [key: string]: number }>({});
  const [plateInfos, setPlateInfos] = useState<{ [key: string]: PlateInfo }>({});

  useEffect(() => {
    dispatch(getAllWeight());
    fetchPlateData();
  }, [dispatch]);

  const fetchPlateData = async () => {
    const newPolicyAmounts: { [key: string]: number } = {};
    const newPlateInfos: { [key: string]: PlateInfo } = {};
    for (const sample of DataSamples) {
      try {
        const response = await dispatch(getPlateWithCustomer({
          plate: sample.plate,
          coverageCode: sample.coverageCode
        }));
        if (response.payload && typeof response.payload === 'object') {
          const plateInfo = response.payload as PlateInfo;
          newPolicyAmounts[sample.plate] = plateInfo.amount || 0;
          newPlateInfos[sample.plate] = plateInfo;
        }
      } catch (error) {
        console.error(`Plaka verisi alınamadı: ${sample.plate}`, error);
      }
    }
    setPolicyAmounts(newPolicyAmounts);
    setPlateInfos(newPlateInfos);
    updateChartData(newPolicyAmounts);
  };

  const updateChartData = (amounts: { [key: string]: number }) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    
    const labels = DataSamples.map(sample => sample.plate);
    const amountsData = labels.map(plate => amounts[plate] || 0);

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
  };

  useEffect(() => {
    if (weights) {
      const initialData = weights
        .map(item => ({ ...item, isNew: false, isUpdated: false }))
        .sort((a, b) => a.type.localeCompare(b.type));
      setData(initialData);
    }
  }, [weights]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
    const { name, value } = e.target;
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [name]: value, isUpdated: !item.isNew } : item
      )
    );
  };

  useEffect(() => {   
    return () => {
        dispatch(resetResponseStatus()); 
    };
  }, [dispatch]);

  const validateData = () => {
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
  
      if (item.type !== WeightsType.GENDER && item.type !== WeightsType.POLICY_TYPE) {
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
  
    return isValid;
  };
  
  const handleSave = async () => {
    if (!validateData()) return;

    const itemsToSave: WeightDto[] = data.map(item => ({ ...item }));
    const response = await dispatch(updateListWeight({ dto: itemsToSave }));
      
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Güncellendi', life: 2000 });
      setData(prevData => prevData.map(item => ({ ...item, isNew: false, isUpdated: false })));
      fetchPlateData();
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
  };

  const handleDelete = async (id: number, key: string) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    const response = await dispatch(deleteWeight({ key: key }));
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Silindi', life: 2000 });
      fetchPlateData();
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
  };

  const handleAddRow = () => {
    const newId = data.length ? Math.max(...data.map(item => item.id)) + 1 : 1;
    const newKey = `new_key_${newId}`;
    const newRow: EditableWeightDto = { id: newId, key: newKey, weight: 0, minValue: 0, maxValue: 0, type: '', isNew: true };
    setData([...data, newRow]);
  };

  if (data.length === 0) {
    return <div>Yükleniyor...</div>;
  }

  const renderTooltip = (plate: string) => (
    <Tooltip id={`tooltip-${plate}`}>
      {plateInfos[plate] ? (
        <>
          <strong>Araç Bilgileri:</strong><br />
          Marka: {plateInfos[plate].car.make}<br />
          Model: {plateInfos[plate].car.model}<br />
          Yıl: {plateInfos[plate].car.year}<br />
          Motor: {plateInfos[plate].car.engine}<br />
          Kilometre: {plateInfos[plate].car.kilometers}<br />
          <br />
          <strong>Müşteri Bilgileri:</strong><br />
          İsim: {plateInfos[plate].customer.name}<br />
          Adres: {plateInfos[plate].customer.address}<br />
          Telefon: {plateInfos[plate].customer.phone}<br />
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
      <Form.Control
        type="number"
        name="minValue"
        value={item.minValue}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        disabled={[WeightsType.POLICY_TYPE, WeightsType.GENDER, WeightsType.CAR_TYPE].includes(item.type as WeightsType)}
      />
    </td>
    <td>
      <Form.Control
        type="number"
        name="maxValue"
        value={item.maxValue}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        disabled={[WeightsType.POLICY_TYPE, WeightsType.GENDER, WeightsType.CAR_TYPE].includes(item.type as WeightsType)}
      />
    </td>
    <td>
      <Form.Select
        name="type"
        value={item.type === 'MALE' || item.type === 'FEMALE' ? 'GENDER' : item.type}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        disabled={!item.isNew}
      >
        <option value="">Tür Seç</option>
        {Object.values(WeightsType)
          .filter(type => item.isNew ? ![WeightsType.GENDER, WeightsType.POLICY_TYPE, WeightsType.CAR_TYPE].includes(type) : true)
          .map(type => (
            <option key={type} value={type}>{type === WeightsType.GENDER ? 'GENDER' : type}</option>
          ))}
      </Form.Select>
    </td>
    <td className="text-center">
  {item.type !== WeightsType.GENDER && item.type !== WeightsType.POLICY_TYPE && item.type !== WeightsType.CAR_TYPE && (
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
        <Row className="mt-5">
          <Col>
            <Chart type="line" data={chartData} options={chartOptions} />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <h4>Plaka Bilgileri</h4>
            <Row xs={1} md={2} lg={3} className="g-4">
              {Object.keys(plateInfos).map(plate => (
                <Col key={plate}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{plate}</Card.Title>
                      <Card.Text>
                        Poliçe Tutarı: {policyAmounts[plate]} TL
                      </Card.Text>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(plate)}
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

export default CarPolicyWeight;
