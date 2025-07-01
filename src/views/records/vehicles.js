import React, { useEffect, useState } from 'react';
import { helpFetch } from '../../components/helpers/helpFetch';
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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react'; 
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'; 
import '../../scss/_custom.scss';

const VehicleRegistration = () => {
  const api = helpFetch();
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [formData, setFormData] = useState({
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleClass: '',
    vehiclePlate: '',
    engineSerial: '',
    chassisSerial: '',
    created_at: '',
    updated_at: '',
    id: null,
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await api.get("vehicles");
      if (!response.error) setVehicles(response);
    };

    const fetchBrands = async () => {
      const response = await api.get("brands"); // Cambia "brands" por la ruta correcta
      if (!response.error) setBrands(response);
    };

    const fetchModels = async () => {
      const response = await api.get("models"); // Cambia "models" por la ruta correcta
      if (!response.error) setModels(response);
    };

    fetchVehicles();
    fetchBrands();
    fetchModels();
  }, []);

  const addVehicle = (vehicle) => {
    const options = { body: vehicle };
    
    api.post("vehicles", options).then((response) => {
      if (!response.error) setVehicles([...vehicles, response]);
    });
  };

  const updateVehicle = (vehicle) => {
    const options = { body: { ...vehicle, updated_at: new Date().toISOString() } };

    api.put("vehicles", options, vehicle.id).then((response) => {
      if (!response.error) {
        const newVehicles = vehicles.map(el => el.id === vehicle.id ? response : el);
        setVehicles(newVehicles);
        setUpdateData(null);
      }
    });
  };

  const deleteVehicle = (id) => {
    setVehicleToDelete(id);
    setModalVisible2(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      api.delete("vehicles", vehicleToDelete).then((response) => {
        if (!response.error) {
          const newVehicles = vehicles.filter(el => el.id !== vehicleToDelete);
          setVehicles(newVehicles);
        }
      });
    }
    setModalVisible2(false);
    setVehicleToDelete(null);
  };

  const cancelDelete = () => {
    setModalVisible2(false);
    setVehicleToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateData != null) {
      updateVehicle(formData);
    } else {
      const currentDate = new Date().toISOString();
      formData.created_at = currentDate;
      formData.updated_at = currentDate;
      formData.id = Date.now().toString();
      addVehicle(formData);
    }
    resetForm();
    setModalVisible(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const resetForm = () => {
    setFormData({
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleColor: '',
      vehicleClass: '',
      vehiclePlate: '',
      engineSerial: '',
      chassisSerial: '',
      created_at: '',
      updated_at: '',
      id: null,
    });
    setUpdateData(null);
  };

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className='bg-primary text-white'>
              <h2>Lista de Vehículos</h2>
            </CCardHeader>
            <CCardBody>
              <CButton color="success" onClick={() => setModalVisible(true)}>
                <CIcon icon={cilPlus} /> Registrar Vehículo
              </CButton>
              <CTable hover responsive className='custom-table mt-3'>
                <CTableHead className="table-light">
                  <CTableRow>
                    <CTableHeaderCell>Marca</CTableHeaderCell>
                    <CTableHeaderCell>Modelo</CTableHeaderCell>
                    <CTableHeaderCell>Año</CTableHeaderCell>
                    <CTableHeaderCell>Color</CTableHeaderCell>
                    <CTableHeaderCell>Clase</CTableHeaderCell>
                    <CTableHeaderCell>Placa</CTableHeaderCell>
                    <CTableHeaderCell>Serial del Motor</CTableHeaderCell>
                    <CTableHeaderCell>Serial de la Carrocería</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vehicles.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="8">No hay datos</CTableDataCell>
                    </CTableRow>
                  ) : (
                    vehicles.map((vehicle) => (
                      <CTableRow key={vehicle.id}>
                        <CTableDataCell>{vehicle.vehicleBrand}</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleModel}</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleYear}</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleColor}</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleClass}</CTableDataCell>
                        <CTableDataCell>{vehicle.vehiclePlate}</CTableDataCell>
                        <CTableDataCell>{vehicle.engineSerial}</CTableDataCell>
                        <CTableDataCell>{vehicle.chassisSerial}</CTableDataCell>
                        <CTableDataCell style={{display:"flex",justifyContent:"flex-end"}}>
                          <CButton className="update" onClick={() => { setUpdateData(vehicle); setModalVisible(true); }}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton className="delete" onClick={() => { deleteVehicle(vehicle.id); }}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para Confirmar Eliminación */}
      <div className={`modal ${modalVisible2 ? 'show' : ''}`} style={{ display: modalVisible2 ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" onClick={cancelDelete} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este registro?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancelar</button>
              <button type="button" style={{backgroundColor:"red"}} className="btn btn-danger text-white" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar/Actualizar Vehículo */}
      <div className={`modal modal-lg modal-fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{updateData ? "Actualizar Vehículo" : "Registrar Nuevo Vehículo"}</h5>
              <button type="button" className="btn-close" onClick={() => setModalVisible(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <CForm onSubmit={handleSubmit}>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormSelect
                      name="vehicleBrand"
                      label="Marca del Vehículo"
                      onChange={handleChange}
                      value={formData.vehicleBrand}
                      required
                    >
                      <option value="">Seleccione una marca</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>{brand.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect
                      name="vehicleModel"
                      label="Modelo del Vehículo"
                      onChange={handleChange}
                      value={formData.vehicleModel}
                      required
                    >
                      <option value="">Seleccione un modelo</option>
                      {models.map((model) => (
                        <option key={model.id} value={model.name}>{model.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="vehicleYear"
                      label="Año del Vehículo"
                      placeholder="Ingrese el año del vehículo"
                      onChange={handleChange}
                      value={formData.vehicleYear}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="vehicleColor"
                      label="Color del Vehículo"
                      placeholder="Ingrese el color del vehículo"
                      onChange={handleChange}
                      value={formData.vehicleColor}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="vehicleClass"
                      label="Clase del Vehículo"
                      placeholder="Ingrese la clase del vehículo"
                      onChange={handleChange}
                      value={formData.vehicleClass}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="vehiclePlate"
                      label="Placa del Vehículo"
                      placeholder="Ingrese la placa del vehículo"
                      onChange={handleChange}
                      value={formData.vehiclePlate}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="engineSerial"
                      label="Serial del Motor"
                      placeholder="Ingrese el serial del motor"
                      onChange={handleChange}
                      value={formData.engineSerial}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="chassisSerial"
                      label="Serial de la Carrocería"
                      placeholder="Ingrese el serial de la carrocería"
                      onChange={handleChange}
                      value={formData.chassisSerial}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton type="submit" className="bg-primary mt-3 bottoms">
                  {updateData ? "Actualizar" : "Registrar"}
                </CButton>
                <CButton type="button" color="secondary" className="mt-3 ms-2" onClick={() => setModalVisible(false)}>
                  Cancelar
                </CButton>
              </CForm>
            </div>
          </div>
        </div>
      </div>
    </CContainer>
  );
};

export default VehicleRegistration;