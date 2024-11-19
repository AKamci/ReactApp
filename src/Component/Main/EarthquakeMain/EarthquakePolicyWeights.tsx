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
import DataSamples from '../../../infrastructure/Helpers/WeightData';
import { getAllEarthquakeWeight } from '../../../infrastructure/Store/Slices/EarthquakePolicyWeightSlices/GetListEarthquakeWeight-Slice';
import { getHouseWithCustomer } from '../../../infrastructure/Store/Slices/HouseSlices/GetHouseWithCustomer-Slice';
import { deleteEarthquakeWeight } from '../../../infrastructure/Store/Slices/EarthquakePolicyWeightSlices/DeleteEarthquakeWeight-Slice';
import AddressData from '../../../infrastructure/Helpers/AddressData';
import HouseData from '../../../infrastructure/Helpers/HouseData';
import EarthquakePolicyType from '../../../infrastructure/Enums/EarthquakePolicyType';
import { updateEarthquakeWeight } from '../../../infrastructure/Store/Slices/EarthquakePolicyWeightSlices/UpdateEarthquakeWeight-Slice';
import { updateListEarthquakeWeight } from '../../../infrastructure/Store/Slices/EarthquakePolicyWeightSlices/UpdateListEarthquakeWeight-Slice';

interface EditableWeightDto extends WeightDto {
  isNew?: boolean;
  isUpdated?: boolean;
}

interface HouseInfo {
  Amount: number;
  amount: number;
  coverageCode: number;
  id: number;
  number: number;
  squareMeters: number;
  customer: {
    id: number;
    name: string;
    tckn: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    birthDay: string;
    gender: number;
    grade: number;
  };
  building: {
    id: number;
    apartmentNumber: number;
    constructionStyle: number;
    constructionYear: number;
    totalFloors: number;
    address: {
      id: number;
      earthquakeRisk: number;
      neighborhood: string;
      district: string;
      city: string;
      buildings: any[];
    }
  };  
}

const EarthquakePolicyWeight: React.FC = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const toastRef = useRef<Toast>(null);
  const dispatch = useAppDispatch();
  const weights = useAppSelector((state) => state.getListEarthquakeWeight.data);
  const [data, setData] = useState<EditableWeightDto[]>([]);
  const houseData = useAppSelector((state) => state.getHouseWithCustomer.data);
  const [policyAmounts, setPolicyAmounts] = useState<{ [key: number]: number }>({});
  const [houseInfos, setHouseInfos] = useState<{ [key: number]: HouseInfo }>({});

  useEffect(() => {
    dispatch(getAllEarthquakeWeight());
    fetchHouseData();
  }, [dispatch]);

  const fetchHouseData = async () => {
    const newPolicyAmounts: { [key: number]: number } = {};
    const newHouseInfos: { [key: number]: HouseInfo } = {};
    for (const sample of HouseData) {
      try {
        const response = await dispatch(getHouseWithCustomer({
          number: sample.number,
          apartmentNumber: sample.apartmentNumber,
          city: sample.city,
          district: sample.district,
          neighborhood: sample.neighborhood,
          coverageCode: sample.coverageCode
        }));
        if (response.payload && typeof response.payload === 'object') {
          const houseInfo = response.payload as HouseInfo;
          console.log(houseInfo, "houseInfo")
          newPolicyAmounts[houseInfo.number] = houseInfo.Amount;
          newHouseInfos[houseInfo.number] = houseInfo;
        }
      } catch (error) {
        console.error(`Ev verisi alınamadı: ${sample.number}`, error);
      }
    }
    setPolicyAmounts(newPolicyAmounts);
    setHouseInfos(newHouseInfos);
    updateChartData(newPolicyAmounts);
  };

  const updateChartData = (amounts: { [key: number]: number }) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    
    const labels = HouseData.map(sample => `${sample.city}, ${sample.district}, ${sample.neighborhood}`);
    const amountsData = HouseData.map(sample => amounts[sample.number] || 0);

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
    const response = await dispatch(updateListEarthquakeWeight({ dto: itemsToSave }));
      
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Güncellendi', life: 2000 });
      setData(prevData => prevData.map(item => ({ ...item, isNew: false, isUpdated: false })));
      fetchHouseData();
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
  };

  const handleDelete = async (id: number, key: string) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    const response = await dispatch(deleteEarthquakeWeight({ key: key }));
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Silindi', life: 2000 });
      fetchHouseData();
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

  const renderTooltip = (number: number) => (
    <Tooltip id={`tooltip-${number}`}> 
      {houseInfos[number] ? (
        <>
          <strong>Bina Bilgileri:</strong><br />
          Apartman No: {houseInfos[number].building.apartmentNumber}<br />
          İnşaat Stili: {houseInfos[number].building.constructionStyle}<br />
          İnşaat Yılı: {houseInfos[number].building.constructionYear}<br />
          Toplam Kat: {houseInfos[number].building.totalFloors}<br />
          Deprem Riski: {houseInfos[number].building.address.earthquakeRisk}<br />
          <br />
          <strong>Müşteri Bilgileri:</strong><br />
          İsim: {houseInfos[number].customer.name}<br />
          Adres: {houseInfos[number].customer.address}<br />
          Telefon: {houseInfos[number].customer.phone}<br />
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
      {![EarthquakePolicyType.POLICY_TYPE, EarthquakePolicyType.CONSTANT, EarthquakePolicyType.CONSTRUCTION_STYLE].includes(item.type as EarthquakePolicyType) && (
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
      {![EarthquakePolicyType.POLICY_TYPE, EarthquakePolicyType.CONSTANT, EarthquakePolicyType.CONSTRUCTION_STYLE].includes(item.type as EarthquakePolicyType) && (
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
      {item.isNew ? (
        <Form.Select
          name="type"
          value={item.type}
          onChange={(e) => handleInputChange(e, item.id)}
          className="border-0"
        >
          <option value="">Tür Seç</option>
          {Object.values(EarthquakePolicyType)
            .filter(type => ![
              EarthquakePolicyType.POLICY_TYPE,
              EarthquakePolicyType.CONSTANT, 
              EarthquakePolicyType.CONSTRUCTION_STYLE
            ].includes(type))
            .map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
        </Form.Select>
      ) : (
        item.type
      )}
    </td>
    <td className="text-center">
  {item.type !== EarthquakePolicyType.CONSTANT && item.type !== EarthquakePolicyType.POLICY_TYPE && item.type !== EarthquakePolicyType.CONSTRUCTION_STYLE && (
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
            <h4>Ev Bilgileri</h4>
            <Row xs={1} md={2} lg={3} className="g-4">
              {HouseData.map((house, index) => (
                <Col key={index}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Ev No: {house.number}</Card.Title>
                      <Card.Text>
                        Poliçe Tutarı: {policyAmounts[house.number] || 'Bilgi Yok'} TL
                      </Card.Text>
                      <Card.Text>
                        Adres: {house.city}, {house.district}, {house.neighborhood}
                      </Card.Text>
                      <Card.Text>
                        Metrekare: {houseInfos[house.number]?.squareMeters || 'Bilgi Yok'} m²
                      </Card.Text>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(house.number)}
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

export default EarthquakePolicyWeight;
