import { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import AddressData from "../../../infrastructure/Helpers/AddressData";
import { useAppDispatch, useAppSelector } from "../../../infrastructure/Store/store";
import { createEarthquakePolicy } from "../../../infrastructure/Store/Slices/EarthQuakeSlices/CreateEarthquake-Slice";
import { Toast } from "primereact/toast";
import { ConfirmPopup } from "primereact/confirmpopup";
import { getHouseWithCustomer } from "../../../infrastructure/Store/Slices/HouseSlices/GetHouseWithCustomer-Slice";
import { Calendar } from "primereact/calendar";

const CreateEarthquakePolicy = () => {
  const dispatch = useAppDispatch();
  const EarthquakePolicy = useAppSelector((state) => state.createEarthquake.data);
  const responseStatus = useAppSelector((state) => state.createEarthquake.responseStatus);
  
  const houseWithCustomer = useAppSelector((state) => state.getHouseWithCustomer.data);

  const toast = useRef<Toast>(null);
  const data = AddressData;
  const buttonEl = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [selectedIl, setSelectedIl] = useState<string>('');
  const [selectedIlce, setSelectedIlce] = useState<string>('');
  const [selectedMahalle, setSelectedMahalle] = useState<string>('');
  const [selectedApartman, setSelectedApartman] = useState<number | ''>('');
  const [selectedDaire, setSelectedDaire] = useState<number | ''>('');

  const [iller, setIller] = useState<string[]>([]);
  const [ilceler, setIlceler] = useState<string[]>([]);
  const [mahalleler, setMahalleler] = useState<string[]>([]);
  const [apartmanlar, setApartmanlar] = useState<number[]>([]);
  const [daireler, setDaireler] = useState<number[]>([]);
  const [policyStartDate, setPolicyStartDate] = useState<Date | null>(null);
  const [policyEndDate, setPolicyEndDate] = useState<Date | null>(null);
  const [policyAmount, setPolicyAmount] = useState<number | null>(null);
  const [policyCoverage, setPolicyCoverage] = useState<number | null>(null);


  const [TCKN, setTCKN] = useState<string>('');
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+ 1);



  const validateForm = (): boolean => {
    if (!selectedIl) {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen il seçiniz.' });
      return false;
    }
    if (!selectedIlce) {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen ilçe seçiniz.' });
      return false;
    }
    if (!selectedMahalle) {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen mahalle seçiniz.' });
      return false;
    }
    if (selectedApartman === '') {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen apartman seçiniz.' });
      return false;
    }
    if (selectedDaire === '') {
      toast.current?.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen daire seçiniz.' });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (policyStartDate) {
      const endDate = new Date(policyStartDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      setPolicyEndDate(endDate);
    }
  }, [policyStartDate]);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setVisible(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
  
    const formData = {
      city: selectedIl,
      district: selectedIlce,
      neighborhood: selectedMahalle,
      apartmentNumber: selectedApartman,
      number: selectedDaire,
      tckn: TCKN,
    };
  
    try {
      console.log("Poliçe oluşturma verileri:", formData);
      await dispatch(createEarthquakePolicy({ dto: formData })).unwrap();
      setVisible(false);
      toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Poliçe başarıyla oluşturuldu.' });
    } catch (error) {
      console.error("Poliçe oluşturulurken hata:", error);
      toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Poliçe oluşturulurken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const accept = async () => {
    console.log(shouldOpenModal);
    setShouldOpenModal(true);
    console.log(policyStartDate);
    console.log(policyEndDate);

    try {
      const response = await dispatch(getHouseWithCustomer({
        building: {
          number: selectedDaire,
          apartmentNumber: selectedApartman,
          city: selectedIl,
          district: selectedIlce,
          neighborhood: selectedMahalle,
          tckn: TCKN,
        }
      })).unwrap()

      if (response && response.building) {
        const waitForHouseInformation = new Promise((resolve) => {
          const checkInformation = setInterval(() => {
            if (houseWithCustomer) {
              clearInterval(checkInformation);
              resolve(houseWithCustomer);
            }
          }, 100);
        });

        await waitForHouseInformation;
        while(!response)
        {
          waitForHouseInformation
        }
        console.log("Veri alındı, şimdi başka işlemler yapabilirsiniz.");
        console.log(houseWithCustomer);
      }
    } catch (error) {
      if (error.status === 404) {
        toast.current?.show({ severity: 'error', summary: 'Uyarı', detail: 'Ev bilgisi bulunamadı.', life: 3000 });
        setShouldOpenModal(false); 
      } else {
        toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Bir hata oluştu.', life: 3000 });
        setShouldOpenModal(false);
      }
    }

    const dto = {
      coverage: policyCoverage,
      policyStartDate: policyStartDate ? policyStartDate.toISOString().split('T')[0] : null,
      policyEndDate: policyEndDate ? policyEndDate.toISOString().split('T')[0] : null, 
      policyOfferDate: new Date().toISOString().split('T')[0],
      tckn: houseWithCustomer.customer?.tckn,
      policyAmount,
    };

    console.log('DTO:', dto);

    await dispatch(createEarthquakePolicy({
      dto: dto
    })).unwrap();
  };

  useEffect(() => {
    const ilKeys = Object.keys(data["Türkiye"]);
    setIller(ilKeys);
    console.log("İller yüklendi:", ilKeys);
  }, []);

  useEffect(() => {
    if (selectedIl && data["Türkiye"][selectedIl]) {
      const ilceKeys = Object.keys(data["Türkiye"][selectedIl]);
      setIlceler(ilceKeys);
      setSelectedIlce('');
      setMahalleler([]);
      setSelectedMahalle('');
      setApartmanlar([]);
      setSelectedApartman('');
      setDaireler([]);
      setSelectedDaire('');
      console.log("İlçeler yüklendi:", ilceKeys);
    }
  }, [selectedIl]);

  useEffect(() => {
    if (selectedIl && selectedIlce && data["Türkiye"][selectedIl]?.[selectedIlce]) {
      const mahalleKeys = Object.keys(data["Türkiye"][selectedIl][selectedIlce]);
      setMahalleler(mahalleKeys);
      setSelectedMahalle('');
      setApartmanlar([]);
      setSelectedApartman('');
      setDaireler([]);
      setSelectedDaire('');
      console.log("Mahalleler yüklendi:", mahalleKeys);
    }
  }, [selectedIlce, selectedIl]);

  useEffect(() => {
    if (selectedIl && selectedIlce && selectedMahalle && data["Türkiye"][selectedIl]?.[selectedIlce]?.[selectedMahalle]) {
      const apartmanKeys = Object.keys(data["Türkiye"][selectedIl][selectedIlce][selectedMahalle]);
      const apartmanNumbers = apartmanKeys.map(Number).filter(num => !isNaN(num)).sort((a, b) => a - b);
      setApartmanlar(apartmanNumbers);
      setSelectedApartman('');
      setDaireler([]);
      setSelectedDaire('');
      console.log("Apartmanlar yüklendi:", apartmanNumbers);
    }
  }, [selectedMahalle, selectedIlce, selectedIl]);

  useEffect(() => {
    if (selectedIl && selectedIlce && selectedMahalle && selectedApartman && data["Türkiye"][selectedIl]?.[selectedIlce]?.[selectedMahalle]?.[selectedApartman]) {
      const daireList = data["Türkiye"][selectedIl][selectedIlce][selectedMahalle][selectedApartman];
      setDaireler(Array.isArray(daireList) ? daireList : []);
      console.log("Daireler yüklendi:", daireList);
    }
  }, [selectedApartman, selectedMahalle, selectedIlce, selectedIl]);

  const reject = () => setVisible(false);

  return (
    <Container>
      <h4 className="my-4">Deprem Sigortası Başvurusu</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="ilSelect">
              <Form.Label>İl</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                value={selectedIl}
                onChange={(e) => setSelectedIl(e.target.value)}
              >
                <option value="">İl Seçin</option>
                {iller.map((il) => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="ilceSelect">
              <Form.Label>İlçe</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                value={selectedIlce}
                onChange={(e) => setSelectedIlce(e.target.value)}
                disabled={!selectedIl}
              >
                <option value="">İlçe Seçin</option>
                {ilceler.map((ilce) => (
                  <option key={ilce} value={ilce}>{ilce}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="mahalleSelect">
              <Form.Label>Mahalle</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                value={selectedMahalle}
                onChange={(e) => setSelectedMahalle(e.target.value)}
                disabled={!selectedIlce}
              >
                <option value="">Mahalle Seçin</option>
                {mahalleler.map((mahalle) => (
                  <option key={mahalle} value={mahalle}>{mahalle}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="apartmanSelect">
              <Form.Label>Apartman</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                value={selectedApartman}
                onChange={(e) => setSelectedApartman(Number(e.target.value))}
                disabled={!selectedMahalle}
              >
                <option value="">Apartman Seçin</option>
                {apartmanlar.map((apartman) => (
                  <option key={apartman} value={apartman}>{apartman}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="daireSelect">
              <Form.Label>Daire</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                value={selectedDaire}
                onChange={(e) => setSelectedDaire(Number(e.target.value))}
                disabled={!selectedApartman}
              >
                <option value="">Daire Seçin</option>
                {daireler.map((daire) => (
                  <option key={daire} value={daire}>Daire {daire}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="policyStartDate">
              <Form.Label>Başlangıç Tarihi</Form.Label>
              <Calendar
                minDate={startDate}
                maxDate={policyEndDate}
                hideOnDateTimeSelect
                value={policyStartDate}
                onChange={(e) => setPolicyStartDate(e.value as Date)}
                showIcon
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="policyEndDate">
              <Form.Label>Bitiş Tarihi</Form.Label>
              <Calendar
                value={policyEndDate}
                minDate={endDate}
                onChange={(e) => setPolicyEndDate(e.value as Date)}
                showIcon
                disabled
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="coverageSelect">
              <Form.Label>Teminat Tutarı</Form.Label>
              <Form.Select 
                value={policyAmount || ''}
                onChange={(e) => setPolicyCoverage(Number(e.target.value))}
                disabled={loading}
              >
                <option value="">Deprem Sigortası Tutarı Seçiniz</option>
                <option value="105">Yarı Kapsamlı</option>
                <option value="106">Tam Kapsamlı</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="mb-3">
          <div className="col-12">
            <Toast ref={toast} />
            <ConfirmPopup
              target={buttonEl.current || undefined}
              visible={visible}
              onHide={() => setVisible(false)}
              message="Poliçe fiyat almak istediğinize emin misiniz?"
              icon="pi pi-exclamation-triangle"
              accept={accept} 
              reject={reject}
              acceptLabel='Evet'
              rejectLabel='Hayır'
            />
            <button
              ref={buttonEl}
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading ? 'Yükleniyor...' : 'Poliçe İçin Fiyat Al'}
              <i className="pi pi-check ml-2"></i>
            </button>
          </div>
        </div>
      </Form>

      {shouldOpenModal && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel"></h5>
                <p className="text-primary">
                  <strong>POLİÇE TEKLİFİNİZ ALINDI </strong>   
                  <br />   
                  <strong>POLİÇE DETAYLARI AŞAĞIDADIR</strong>      
                </p>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShouldOpenModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <div className="accordion accordion-flush" id="accordionFlushExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingOne">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          EV BİLGİLERİ
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <p><strong>Daire Numarası:</strong> {houseWithCustomer?.number}</p>
                          <p><strong>Metrekare(m²):</strong> {houseWithCustomer?.squareMeters}</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingTwo">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseTwo"
                          aria-expanded="false"
                          aria-controls="flush-collapseTwo"
                        >

                          MÜŞTERİ BİLGİLERİ
                        </button>
                      </h2>
                      <div
                        id="flush-collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingTwo"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <p><strong>Ad:</strong> {houseWithCustomer?.customer?.name}</p>
                          <p><strong>Cinsiyet:</strong> {houseWithCustomer?.customer?.gender === 0 ? "Kadın" : "Erkek"}</p>
                          <p><strong>TCKN:</strong> {houseWithCustomer?.customer?.tckn}</p>
                          <p><strong>Adres:</strong> {houseWithCustomer?.customer?.address}</p>
                          <p><strong>Telefon:</strong> {houseWithCustomer?.customer?.phone}</p>
                          <p><strong>Mail Adresi:</strong> {houseWithCustomer?.customer?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingThree">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseThree"
                          aria-expanded="false"
                          aria-controls="flush-collapseThree"
                        >

                          ADRES BİLGİSİ

                        </button>
                      </h2>
                      <div
                        id="flush-collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingThree"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <p><strong>Apartman Numarası:</strong> {houseWithCustomer?.building?.apartmentNumber}</p>
                          <p><strong>Mahalle:</strong> {houseWithCustomer?.building?.address[0]?.neighborhood}</p>
                          <p><strong>İlçe:</strong> {houseWithCustomer?.building?.address[0]?.district}</p>
                          <p><strong>İl:</strong> {houseWithCustomer?.building?.address[0]?.city}</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingFour">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseFour"
                          aria-expanded="false"
                          aria-controls="flush-collapseFour"
                        >

                          
                          POLİÇE BİLGİLERİ
                        </button>
                      </h2>
                      <div
                        id="flush-collapseFour"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingFour"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <p><strong>Poliçe Açıklaması:</strong> {EarthquakePolicy?.coverage?.coverageDescription}</p>
                          <p><strong>Başlangıç Tarihi:</strong> {EarthquakePolicy?.policyStartDate ? EarthquakePolicy.policyStartDate.toLocaleDateString() : 'Belirtilmemiş'}</p>
                          <p><strong>Bitiş Tarihi:</strong> {EarthquakePolicy?.policyEndDate ? EarthquakePolicy.policyEndDate.toLocaleDateString() : 'Belirtilmemiş'}</p>
                          <p><strong>Poliçe Fiyat:</strong> {EarthquakePolicy?.policyAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => setShouldOpenModal(false)}>Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CreateEarthquakePolicy;
