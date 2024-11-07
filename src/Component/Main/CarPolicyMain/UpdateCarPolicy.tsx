import React, { useEffect, useRef, useState } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from '../../../infrastructure/Store/store';
import { getAllWeight } from '../../../infrastructure/Store/Slices/WeightSlices/GetListWeight-Slice';
import { WeightDto } from '../../../infrastructure/dto/WeightDto';
import WeightsType from '../../../infrastructure/Enums/WeightsType';
import { updateListWeight, resetResponseStatus } from '../../../infrastructure/Store/Slices/WeightSlices/UpdateListWeight-Slice';
import { Toast } from 'primereact/toast';
import { deleteWeight } from '../../../infrastructure/Store/Slices/WeightSlices/DeleteWeight-Slice';
import { Chart } from 'primereact/chart';

interface EditableWeightDto extends WeightDto {
  isNew?: boolean;
  isUpdated?: boolean;
}

const WeightList: React.FC = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const data = {
      labels: ['Araç1', 'Araç2', 'Araç3', 'Araç4', 'Araç5', 'Araç6', 'Araç7'],
      datasets: [
        { label: 'Kasko', data: [5, 59, 80, 81, 56, 55, 40], borderColor: documentStyle.getPropertyValue('--blue-500') },
        { label: 'Trafik', data: [28, 48, 40, 19, 86, 27, 90], borderColor: documentStyle.getPropertyValue('--pink-500') }
      ]
    };
    setChartData(data);
    setChartOptions({
      scales: { x: { ticks: { color: textColorSecondary } }, y: { ticks: { color: textColorSecondary } } }
    });
  }, []);

  const dispatch = useAppDispatch();
  const weights = useAppSelector((state) => state.getListWeight.data);
  const [data, setData] = useState<EditableWeightDto[]>([]);

  useEffect(() => {
    dispatch(getAllWeight());
  }, [dispatch]);

  useEffect(() => {
    if (weights) {
      const initialData = weights.map(item => ({ ...item, isNew: false, isUpdated: false }));
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

    data.forEach(item => {
      if (!item.key) {
        toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: `Key alanı boş bırakılamaz. (ID: ${item.id})`, life: 2000 });
        isValid = false;
      }
      if (item.minValue > item.maxValue) {
        toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: `Min değer, Max değerden büyük olamaz. (ID: ${item.id})`, life: 2000 });
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSave = async () => {
    if (!validateData()) return;

    const itemsToSave: WeightDto[] = data.map(item => ({ ...item }));
    const response = await dispatch(updateListWeight({ dto: itemsToSave }));
      
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Güncellendi', life: 2000 });
      setData(prevData => prevData.map(item => ({ ...item, isNew: false, isUpdated: false })));
      updateChart();
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
  };

  const handleDelete = async (id: number, key: string) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    const response = await dispatch(deleteWeight({ key: key }));
    if (response.meta.requestStatus === 'fulfilled') {
      toastRef.current?.show({ severity: 'success', summary: 'Bilgi', detail: 'Parametre Silindi', life: 2000 });
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Hata', detail: 'Sunucuya ulaşılamadı.', life: 3000 });
    }
  };

  const handleAddRow = () => {
    const newId = data.length ? data[data.length - 1].id + 1 : 1;
    const newRow: EditableWeightDto = { id: newId, key: '', weight: 0, minValue: 0, maxValue: 0, type: '', isNew: true };
    setData([...data, newRow]);
  };

  const updateChart = () => {
    setChartData({...chartData}); // Refresh chart with updated data
  };

  return (
    <div>
      <Container className="mt-5">
        <Toast ref={toastRef} />
        <Row className="justify-content-center mb-4">
          <Col md="auto">
            <h2>Veri Düzenleme Paneli</h2>
          </Col>
        </Row>
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
                    disabled={[WeightsType.POLICY_TYPE, WeightsType.GENDER].includes(item.type as WeightsType)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="maxValue"
                    value={item.maxValue}
                    onChange={(e) => handleInputChange(e, item.id)}
                    className="border-0"
                    disabled={[WeightsType.POLICY_TYPE, WeightsType.GENDER].includes(item.type as WeightsType)}
                  />
                </td>
                <td>
                  <Form.Select
                    name="type"
                    value={item.type}
                    onChange={(e) => handleInputChange(e, item.id)}
                    className="border-0"
                  >
                    <option value={WeightsType.CUSTOMER_AGE}>CUSTOMER AGE</option>
                    <option value={WeightsType.GENDER}>GENDER</option>
                    <option value={WeightsType.CUSTOMER_GRADE}>CUSTOMER GRADE</option>
                    <option value={WeightsType.ENGINE}>ENGINE</option>
                    <option value={WeightsType.CAR_PRICE}>CAR PRICE</option>
                    <option value={WeightsType.POLICY_TYPE}>POLICY TYPE</option>
                    <option value={WeightsType.CONSTANT}>CONSTANT</option>
                    <option value={WeightsType.CAR_AGE}>CAR AGE</option>
                  </Form.Select>
                </td>
                <td>
                  {item.type !== WeightsType.POLICY_TYPE && item.type !== WeightsType.GENDER && (
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.key)}>Sil</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-end mt-3">
          <Button variant="primary" onClick={handleAddRow} className="me-2">Satır Ekle</Button>
          <Button variant="success" onClick={handleSave}>Kaydet</Button>
        </div>
        <Row className="mt-5">
          <Col>
            <Chart type="line" data={chartData} options={chartOptions} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WeightList;
