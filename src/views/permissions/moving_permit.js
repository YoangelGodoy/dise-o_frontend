import React, { useEffect, useState } from "react";
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
  CContainer
} from "@coreui/react";

const MovingPermitForm = () => {
  const api = helpFetch();
  const [loggedInUser , setLoggedInUser ] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    municipalityDeparture: "Michelena", // Municipio de salida
    arrivalPlace: "", // Lugar de llegada
    vehicleId: "", // ID del vehículo seleccionado
    document: null // Para el documento de mudanza
  });

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUserId = JSON.parse(localStorage.getItem('user')).id;
      if (loggedInUserId) {
        const response = await api.get(`loggedInUsers/${loggedInUserId}`);
        if (!response.error) {
          setLoggedInUser (response);
          setFormData((prevState) => ({
            ...prevState,
            userId: response.idCard, // Autocompletar cédula
            userName: response.name // Autocompletar nombre
          }));
        }
      }

      const vehiclesResponse = await api.get("vehicles");
      if (!vehiclesResponse.error) setVehicles(vehiclesResponse);
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
    const movingPermitRequest = {
      ...formData,
      requestDate: new Date().toISOString()
    };

    const response = await api.post("movingPermits", { body: movingPermitRequest });
    if (!response.error) {
      alert("¡Permiso de mudanza enviado con éxito!");
    } else {
      alert("Error al enviar el permiso de mudanza. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Solicitar Permiso de Mudanza</h2>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="userId"
                  label="Cédula del Ciudadano"
                  value={formData.userId}
                  readOnly // Campo de cédula autocompletado
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  name="userName"
                  label="Nombre del Ciudadano"
                  value={formData.userName}
                  readOnly // Campo de nombre autocompletado
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  name="municipalityDeparture"
                  label="Municipio de Salida"
                  value={formData.municipalityDeparture}
                  readOnly // Campo de municipio de salida autocompletado
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  name="arrivalPlace"
                  label="Lugar de Llegada (Municipio y Estado)"
                  value={formData.arrivalPlace}
                  onChange={handleChange}
                  placeholder="Ingrese el lugar de llegada"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  name="vehicleId"
                  label="Seleccionar Vehículo"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un vehículo</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleBrand} - {vehicle.vehicleModel} - {vehicle.vehiclePlate}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="file"
                  name="document"
                  label="Documento de Mudanza"
                  onChange={(e) => setFormData({ ...formData, document: e.target.files[0] })}
                />
              </CCol>
            </CRow>
            <CButton type="submit" className="bottoms">
              Enviar Permiso
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default MovingPermitForm;