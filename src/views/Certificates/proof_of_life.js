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

const LifeCertificateRequestForm = () => {
  const api = helpFetch();
  const [loggedInUser , setLoggedInUser ] = useState(null);
  const [nationalities, setNationalities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    nationality: "",
    residentialAddress: "",
    prefecture: "" ,
    status:"Pendiente"
  });

  // Estados para el modal de mensajes (éxito/error de API)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' o 'error' para el color del botón

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUserId = JSON.parse(localStorage.getItem('user')).id;
      if (loggedInUserId) {
        const response = await api.get(`loggedInUsers/${loggedInUserId}`);
        if (!response.error) {
          setLoggedInUser (response);
          setFormData((prevState) => ({
            ...prevState,
            name: response.name || "",
            lastName: response.lastName || ""
          }));
        }
      }

      const nationalitiesResponse = await api.get("nationalities");
      if (!nationalitiesResponse.error) setNationalities(nationalitiesResponse);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lifeCertificateRequest = {
      ...formData,
      requestDate: new Date().toISOString()
    };

    const response = await api.post("lifeCertificateRequests", { body: lifeCertificateRequest });
    if (!response.error) {
      setModalTitle("¡Éxito!");
      setModalMessage("¡Solicitud de constancia de fe de vida enviada con éxito!");
      setModalType("success");
      setShowModal(true);
      // Opcional: resetear el formulario después de un envío exitoso
      setFormData((prevState) => ({
        ...prevState, // Mantener name y lastName autocompletados si el usuario está logueado
        nationality: "",
        residentialAddress: "",
        prefecture: "" ,
        status:"Pendiente"
      }));
    } else {
      setModalTitle("Error");
      setModalMessage("Error al enviar la solicitud de constancia de fe de vida. Por favor, inténtalo de nuevo.");
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Solicitar Constancia de Fe de Vida</h2>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
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
                <CFormSelect
                  name="nationality"
                  label="Nacionalidad"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una nacionalidad</option>
                  {nationalities.map((nationality) => (
                    <option key={nationality.id} value={nationality.id}>
                      {nationality.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="residentialAddress"
                  label="Dirección de Residencia"
                  value={ formData.residentialAddress}
                  onChange={handleChange}
                  placeholder="Ingrese su dirección de residencia"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="prefecture"
                  label="Prefectura"
                  value={formData.prefecture}
                  onChange={handleChange}
                  placeholder="Ingrese la prefectura"
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

      {/* Modal de Mensajes (Éxito/Error) */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)}>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{modalMessage}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color={modalType === "success" ? "success" : "danger"} onClick={() => setShowModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default LifeCertificateRequestForm;
