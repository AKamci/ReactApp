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
      const initialData = weights
        .map(item => ({ ...item, isNew: false, isUpdated: false }))
        .sort((a, b) => a.type.localeCompare(b.type)); // `type` değerine göre sıralama
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
  
      // Boş Alan Kontrolü
      if (!item.key || item.weight === undefined || item.minValue === undefined || item.maxValue === undefined || !item.type) {
        itemHasError = true;
        errorMessage = "Tüm alanları doldurunuz.";
      }
  
      // Aynı Key İsminin Kontrolü
      if (keySet.has(item.key)) {
        itemHasError = true;
        errorMessage = "Key alanları aynı veya boş olamaz..";
      } else {
        keySet.add(item.key);
      }
  
      // Min ve Max Değer Kontrolü (sadece GENDER ve POLICY_TYPE dışındaki türler için)
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
    setChartData({ ...chartData }); // Refresh chart with updated data
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
        value={item.type === 'MALE' || item.type === 'FEMALE' ? 'GENDER' : item.type}
        onChange={(e) => handleInputChange(e, item.id)}
        className="border-0"
        disabled={!item.isNew} // Veritabanından gelenler için disabled
      >
        <option value="">Tür Seç</option>
        {Object.values(WeightsType)
          .filter(type => item.isNew ? type !== WeightsType.GENDER : true)
          .map(type => (
            <option key={type} value={type}>{type === WeightsType.GENDER ? 'GENDER' : type}</option>
          ))}
      </Form.Select>
    </td>
    <td className="text-center">
  {item.type !== WeightsType.GENDER && item.type !== WeightsType.POLICY_TYPE && (
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
