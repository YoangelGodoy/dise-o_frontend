import React, { useState, useEffect } from "react";
import { helpFetch } from "../../components/helpers/helpFetch";
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CModal,         // Importar CModal
  CModalHeader,   // Importar CModalHeader
  CModalTitle,    // Importar CModalTitle
  CModalBody,     // Importar CModalBody
  CModalFooter,   // Importar CModalFooter
} from "@coreui/react";

const CitationRequestForm = () => {
  const api = helpFetch();
  const [loggedInUser , setLoggedInUser ] = useState(null);
  const [prefectures, setPrefectures] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [filteredParishes, setFilteredParishes] = useState([]);
  const [formData, setFormData] = useState({
    prefecture: "",
    name: "",
    lastName: "",
    residentialAddress: "",
    parish: "",
    status:"Pendiente"
  });

  // Estados para el modal de confirmación/éxito
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUserId = JSON.parse(localStorage.getItem('user')).id;
      if (loggedInUserId) {
        const response = await api.get(`loggedInUsers/${loggedInUserId}`);
        if (!response.error) {
          setLoggedInUser (response);
          setFormData((prevState) => ({
            ...prevState,
            name: response.name,
            lastName: response.lastName
          }));
        }
      }

      const prefecturesResponse = await api.get("prefecture");
      if (!prefecturesResponse.error) setPrefectures(prefecturesResponse);

      const parishesResponse = await api.get("parishes");
      if (!parishesResponse.error) setParishes(parishesResponse);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "prefecture") {
      const selectedPrefectureId = value;
      const selectedPrefecture = prefectures.find(pref => pref.id === selectedPrefectureId);

      if (selectedPrefecture) {
        const filtered = parishes.filter(parish => parish.municipality_id === selectedPrefecture.municipality_id);
        setFilteredParishes(filtered);
      } else {
        setFilteredParishes([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const citationRequest = {
      ...formData,
      requestDate: new Date().toISOString()
    };

    const response = await api.post("citationRequests", { body: citationRequest });
    if (!response.error) {
      setModalTitle("¡Éxito!");
      setModalMessage("¡Solicitud de citación enviada con éxito!");
      setShowModal(true);
      // Opcional: resetear el formulario después de un envío exitoso
      setFormData({
        prefecture: "",
        name: loggedInUser ? loggedInUser.name : "", // Mantener autocompletado si el usuario está logueado
        lastName: loggedInUser ? loggedInUser.lastName : "", // Mantener autocompletado si el usuario está logueado
        residentialAddress: "",
        parish: "",
        status:"Pendiente"
      });
    } else {
      setModalTitle("Error");
      setModalMessage("Error al enviar la solicitud de citación. Por favor, inténtalo de nuevo.");
      setShowModal(true);
    }
  };

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Solicitar una citación</h2>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  name="prefecture"
                  label="Prefectura"
                  value={formData.prefecture}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una prefectura</option>
                  {prefectures.map((prefecture) => (
                    <option key={prefecture.id} value={prefecture.id}>
                      {prefecture.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  name="parish"
                  label="Parroquia"
                  value={formData.parish}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una parroquia</option>
                  {filteredParishes.map((parish) => (
                    <option key={parish.id} value={parish.id}>
                      {parish.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="name"
                  label="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingrese su Nombre"
                  required
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  name="lastName"
                  label="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ingrese su Apellido"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="residentialAddress"
                  label="Dirección de Residencia"
                  value={formData.residentialAddress}
                  onChange={handleChange}
                  placeholder="Ingrese su dirección de residencia"
                  required
                />
              </CCol>
            </CRow>
            <CButton type="submit" className="bg-primary bottoms">
              Enviar Solicitud
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Modal de Confirmación/Mensaje */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)}>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{modalMessage}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CitationRequestForm;
