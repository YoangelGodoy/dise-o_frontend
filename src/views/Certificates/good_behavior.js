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

const goodbehaviorCertificateForm = () => {
  const api = helpFetch();
  const [prefectures, setPrefectures] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [filteredParishes, setFilteredParishes] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    prefecture: "",
    parish: "",
    citizenId: "",
    citizenName: "",
    citizenNationality: "",
    reason: "",
    residentialAddress: "",
    witness1Id: "",
    witness2Id: "",
    status:"Pendiente"
  });
  const [error, setError] = useState(""); // Este error es para la validación de testigos

  // Estados para el modal de mensajes (éxito/error de API)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' o 'error' para el color del botón

  useEffect(() => {
    const fetchData = async () => {
      const prefecturesResponse = await api.get("prefecture");
      if (!prefecturesResponse.error) setPrefectures(prefecturesResponse);

      const parishesResponse = await api.get("parishes");
      if (!parishesResponse.error) setParishes(parishesResponse);

      const citizensResponse = await api.get("citizen");
      if (!citizensResponse.error) setCitizens(citizensResponse);

      const countriesResponse = await api.get("nationalities");
      if (!countriesResponse.error) setCountries(countriesResponse);
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

    // Validar que los testigos no sean el mismo
    if (formData.witness1Id && formData.witness2Id && formData.witness1Id === formData.witness2Id) {
      setError("Los testigos no pueden ser la misma persona.");
      return;
    } else {
      setError(""); // Limpiar el error si la validación es correcta
    }

    const goodbehaviorCertificate = {
      ...formData,
      requestDate: new Date().toISOString()
    };

    const response = await api.post("goodbehaviorCertificates", { body: goodbehaviorCertificate });
    if (!response.error) {
      setModalTitle("¡Éxito!");
      setModalMessage("¡Constancia de buena conducta enviada con éxito!");
      setModalType("success");
      setShowModal(true);
      // Opcional: resetear el formulario después de un envío exitoso
      setFormData({
        prefecture: "",
        parish: "",
        citizenId: "",
        citizenName: "",
        citizenNationality: "",
        reason: "",
        residentialAddress: "",
        witness1Id: "",
        witness2Id: "",
        status:"Pendiente"
      });
    } else {
      setModalTitle("Error");
      setModalMessage("Error al enviar la constancia de buena conducta. Por favor, inténtalo de nuevo.");
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Solicitar Constancia de Buena Conducta</h2>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
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
                  name="citizenId"
                  label="Cédula del Ciudadano"
                  value={formData.citizenId}
                  onChange={handleChange}
                  placeholder="Ingrese la cédula del ciudadano"
                  required
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  name="citizenName"
                  label="Nombre del Ciudadano"
                  value={formData.citizenName}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del ciudadano"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
             <CCol>
                <CFormSelect
                  name="citizenNationality"
                  label="Nacionalidad del Ciudadano"
                  value={formData.citizenNationality}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una nacionalidad</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="reason"
                  label="Motivo de la Constancia"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Ingrese el motivo de la constancia"
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
                  placeholder="Ingrese la dirección de residencia"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  name="witness1Id"
                  label="Testigo 1 (Cédula)"
                  value={formData.witness1Id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un testigo</option>
                  {citizens.map((citizen) => (
                    <option key={citizen.id} value={citizen.id}>
                      {citizen.nombre} - {citizen.cedula}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  name="witness2Id"
                  label="Testigo 2 (Cédula)"
                  value={formData.witness2Id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un testigo</option>
                  {citizens.map((citizen) => (
                    <option key={citizen.id} value={citizen.id}>
                      {citizen.nombre} - {citizen.cedula}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CButton type="submit" className="bottoms bg-primary">
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

export default goodbehaviorCertificateForm;
