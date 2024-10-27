import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerDefault: React.FC = () => {
  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8} className="offset-md-2">
          <h1 className="text-center mb-4">Müşteri Ana Ekran</h1>
          <Row>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Hizmet 1</Card.Title>
                  <Card.Text>
                    Bu bölüm, hizmet hakkında bilgilendirici bir metin içermektedir. 
                    Daha fazla bilgi almak için aşağıdaki butona tıklayın.
                  </Card.Text>
                  <Button variant="primary" disabled>
                    Daha Fazla Bilgi
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Hizmet 2</Card.Title>
                  <Card.Text>
                    Bu bölüm, hizmet hakkında bilgilendirici bir metin içermektedir. 
                    Daha fazla bilgi almak için aşağıdaki butona tıklayın.
                  </Card.Text>
                  <Button variant="primary" disabled>
                    Daha Fazla Bilgi
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Hizmet 3</Card.Title>
                  <Card.Text>
                    Bu bölüm, hizmet hakkında bilgilendirici bir metin içermektedir. 
                    Daha fazla bilgi almak için aşağıdaki butona tıklayın.
                  </Card.Text>
                  <Button variant="primary" disabled>
                    Daha Fazla Bilgi
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Bize Ulaşın</Card.Title>
                  <Card.Text>
                    İletişim bilgilerimiz veya destek almak için buraya yazabilirsiniz.
                  </Card.Text>
                  <Button variant="success" disabled>
                    İletişim
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDefault;