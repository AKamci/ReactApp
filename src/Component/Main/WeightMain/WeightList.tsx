import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';

interface DataItem {
  id: number;
  key: string;
  weight: number;
  minValue: number;
  maxValue: number;
  type: string;
}

const WeightList: React.FC = () => {
  // Örnek veriler; bunları API'den çekebilirsiniz
  const [data, setData] = useState<DataItem[]>([
    { id: 1, key: 'Key1', weight: 10, minValue: 0, maxValue: 100, type: 'TypeA' },
    { id: 2, key: 'Key2', weight: 20, minValue: 10, maxValue: 200, type: 'TypeB' },
  ]);

  // Değerleri güncelleme fonksiyonu
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { name, value } = e.target;
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  // Kaydet butonuna tıklanınca yapılacak işlemler
  const handleSave = () => {
    console.log('Kaydedilen veriler:', data);
    // Burada verileri API'ye gönderebilirsiniz
  };

  return (
    <Container className="mt-4">
      <h3>Veri Düzenleme</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Key</th>
            <th>Weight</th>
            <th>Min Value</th>
            <th>Max Value</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>
                <Form.Control
                  type="text"
                  name="key"
                  value={item.key}
                  onChange={(e) => handleInputChange(e, item.id)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="weight"
                  value={item.weight}
                  onChange={(e) => handleInputChange(e, item.id)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="minValue"
                  value={item.minValue}
                  onChange={(e) => handleInputChange(e, item.id)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="maxValue"
                  value={item.maxValue}
                  onChange={(e) => handleInputChange(e, item.id)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  name="type"
                  value={item.type}
                  onChange={(e) => handleInputChange(e, item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={handleSave}>
        Kaydet
      </Button>
    </Container>
  );
};

export default WeightList;
