import React, { useEffect, useState } from 'react';
import { helpFetch } from '../../components/helpers/helpFetch';
import {
  CForm,
  CFormInput,
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
import { cilPencil, cilSearch, cilTrash, cilUserPlus } from '@coreui/icons'; 
import '../../scss/_custom.scss';

const ACitizens = () => {
  const api = helpFetch();
  const [updateData, setUpdateData] = useState(null);
  const [citizens, setCitizens] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [citizenToDelete, setCitizenToDelete] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    created_at: '',
    updated_at: '',
    id: null,
  });

  useEffect(() => {
    const fetchCitizens = async () => {
      const response = await api.get("citizen");
      if (!response.error) setCitizens(response);
    };

    fetchCitizens();
  }, []);

  const addCitizen = (add) => {
    const options = { body: add };
    
    api.post("citizen", options).then((response) => {
      if (!response.error) setCitizens([...citizens, response]);
    });
  };

  const updateCitizen = (add) => {
    const options = { body: { ...add, updated_at: new Date().toISOString() } };

    api.put("citizen", options, add.id).then((response) => {
      if (!response.error) {
        const newCitizens = citizens.map(el => el.id === add.id ? response : el);
        setCitizens(newCitizens);
        setUpdateData(null);
      }
    });
  };

  const deleteCitizen = (id) => {
    setCitizenToDelete(id);
    setModalVisible2(true);
  };

  const confirmDelete = () => {
    if (citizenToDelete) {
      api.delet("citizen", citizenToDelete).then((response) => {
        if (!response.error) {
          const newCitizens = citizens.filter(el => el.id !== String(citizenToDelete));
          setCitizens(newCitizens);
        }
      });
    }
    setModalVisible2(false);
    setCitizenToDelete(null);
  };

  const cancelDelete = () => {
    setModalVisible2(false);
    setCitizenToDelete(null);
  };

  useEffect(() => {
    if (updateData != null) {
      setFormData(updateData);
    } else {
      resetForm();
    }
  }, [updateData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateData != null) {
      updateCitizen(formData);
    } else {
      const currentDate = new Date().toISOString();
      formData.created_at = currentDate;
      formData.updated_at = currentDate;
      formData.id = Date.now().toString();
      addCitizen(formData);
      resetForm();
    }
    setModalVisible(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleCancel = () => {
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setFormData({
      cedula: '',
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono: '',
      created_at: '',
      updated_at: '',
      id: null,
    });
    setUpdateData(null);
  };

  const filteredCitizens = citizens.filter(citizen => {
    return (
      citizen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.cedula.includes(searchTerm)
    );
  });

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className='bg-primary text-white'>
              <h2>Lista de Ciudadanos</h2>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className='mb-4 shadow-sm'>
            <CCardHeader style={{display:"flex", alignItems:"center"}}>
              <CIcon icon={cilSearch}/>
              <CFormInput
                type="text"
                placeholder="Buscar por cédula o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '300px', marginLeft:"10px",marginRight:"600px"}}
              />
              <CButton color="success" onClick={() => setModalVisible(true)}>
                <CIcon icon={cilUserPlus} />
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive className='custom-table'>
                <CTableHead className="table-light">
                  <CTableRow>
                    <CTableHeaderCell>Cédula</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Apellido</CTableHeaderCell>
                    <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                    <CTableHeaderCell>Dirección</CTableHeaderCell>
                    <CTableHeaderCell>Teléfono</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredCitizens.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="7">No hay datos</CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredCitizens.map((citizen) => (
                      <CTableRow key={citizen.id}>
                        <CTableDataCell>{citizen.cedula}</CTableDataCell>
                        <CTableDataCell>{citizen.nombre}</CTableDataCell>
                        <CTableDataCell>{citizen.apellido}</CTableDataCell>
                        <CTableDataCell>{new Date(citizen.fecha_nacimiento).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>{citizen.direccion}</CTableDataCell>
                        <CTableDataCell>{citizen.telefono}</CTableDataCell>
                        <CTableDataCell style={{display:"flex",justifyContent:"flex-end"}}>
                          <CButton className="update" onClick={() => { setUpdateData(citizen); setModalVisible(true); }}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton className="delete" onClick={() => {deleteCitizen(citizen.id);}}>
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

      {/* Modal de Confirmación de Eliminación */}
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

      {/* Modal para Agregar/Actualizar Ciudadano */}
      <div className={`modal modal-lg modal fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none', margin: '0 auto' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{updateData ? "Actualizar Ciudadano" : "Registrar Nuevo Ciudadano"}</h5>
              <button type="button" className="btn-close" onClick={handleCancel} aria-label="Close"></button>
            </div>
            <div className ="modal-body">
              <CForm onSubmit={handleSubmit}>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="cedula"
                      name="cedula"
                      label="Cédula"
                      placeholder="Ingrese la cédula del ciudadano"
                      onChange={handleChange}
                      value={formData.cedula}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="nombre"
                      name="nombre"
                      label="Nombre"
                      placeholder="Ingrese el nombre"
                      onChange={handleChange}
                      value={formData.nombre}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="apellido"
                      name="apellido"
                      label="Apellido"
                      placeholder="Ingrese el apellido"
                      onChange={handleChange}
                      value={formData.apellido}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="date"
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      label="Fecha de Nacimiento"
                      onChange={handleChange}
                      value={formData.fecha_nacimiento}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3 mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="direccion"
                      name="direccion"
                      label="Dirección"
                      placeholder="Ingrese la dirección"
                      onChange={handleChange}
                      value={formData.direccion}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="tel"
                      id="telefono"
                      name="telefono"
                      label="Teléfono"
                      placeholder="Ingrese el teléfono"
                      onChange={handleChange}
                      value={formData.telefono}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton type="submit" color="primary" className="mt-3">
                  {updateData ? "Actualizar" : "Registrar"}
                </CButton>
                <CButton type="button" color="secondary" className="mt-3 ms-2" onClick={handleCancel}>
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

export default ACitizens;