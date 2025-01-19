import React, { useEffect, useState } from 'react';
import { helpFetch } from '/src/components/helpers/helpFetch';
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
  CTableDataCell,
  CFormSelect
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react'; 
import { cilPencil, cilSearch, cilTrash,cilUserPlus } from '@coreui/icons'; 
import '../../scss/_custom.scss'

const AClients = () => {
  const api = helpFetch();
  const [updateData, setUpdateData] = useState(null);
  const [clients, setClients] = useState([]);
  const [states, setStates] = useState([]); 
  const [municipalities, setMunicipalities] = useState([]); 
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]); 
  const [modalVisible2, setModalVisible2] = useState(false); // Estado para el modal2
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [clientToDelete, setClientToDelete] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  

//////////////////////////////////////////////  
  useEffect(() => {
    const fetchclients = async () => {
      const response = await api.get("client");
      if (!response.error) setClients(response);
    };

    fetchclients();

    const fetchStates = async () => {
      const response = await api.get("state"); 
      if (!response.error) setStates(response);
    };

    fetchStates();

    const fetchMunicipalities = async () => {
      const response = await api.get("municipality"); 
      if (!response.error) setMunicipalities(response);
    };

    fetchMunicipalities();
  }, []);

//////////////////////////////////////////////

  const addClient = (add) => {
    const options = { body: add };
    
    api.post("client", options).then((response) => {
      if (!response.error) setClients([...clients, response]);
    });
  };

  const updateClient = (add) => {
    const options = { body: { ...add, updated_at: new Date().toISOString() } };

    api.put("client", options, add.id).then((response) => {
      if (!response.error) {
        const newClients = clients.map(el => el.id === add.id ? response : el);
        setClients(newClients);
        setUpdateData(null);
      }
    });
  };

  const deleteClient = (id) => {
    setClientToDelete(id); // Guarda el id del cliente a eliminar
    setModalVisible2(true); // Muestra el modal
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      api.delet("client", clientToDelete).then((response) => {
        if (!response.error) {
          const newClients = clients.filter(el => el.id !== String(clientToDelete));
          setClients(newClients);
        }
      });
    }
    setModalVisible2(false); // Cierra el modal
    setClientToDelete(null); // Resetea el cliente a eliminar
  };

  const cancelDelete = () => {
    setModalVisible2(false); // Cierra el modal sin hacer nada
    setClientToDelete(null); // Resetea el cliente a eliminar
  };

  const [formData, setFormData] = useState({
    id_client: '',
    name_client: '',
    lastname_client: '',
    fkid_municipality: '',
    phone: '',
    created_at: '',
    updated_at: '',
    id: null,
    fkid_state: ''
  });

  useEffect(() => {
    if (updateData != null) {
      setFormData(updateData);

      const selectedStateId = updateData.fkid_municipality ? municipalities.find(m => m.id_municipality === updateData.fkid_municipality)?.fkid_state : null;
      if (selectedStateId) {
        const filtered = municipalities.filter(m => m.fkid_state === selectedStateId);
        setFilteredMunicipalities(filtered);
      }
    } else {
      setFormData({
        id_client: '',
        name_client: '',
        lastname_client: '',
        fkid_municipality: '',
        phone: '',
        created_at: '',
        updated_at: '',
        id: null, 
      });
      setFilteredMunicipalities([]); 
    }
  }, [updateData, municipalities]);

  ////////////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateData != null) {
      updateClient(formData);
    } else {
      const currentDate = new Date().toISOString();
      formData.created_at = currentDate;
      formData.updated_at = currentDate;
      formData.id = Date.now().toString();
      addClient(formData);
      resetForm();
    }
    setModalVisible(false); // Cierra el modal después de agregar o actualizar
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    });

    
    if (e.target.name === 'fkid_state') {
      const selectedStateId = e.target.value;
      const filtered = municipalities.filter(m => m.fkid_state === selectedStateId);
      setFilteredMunicipalities(filtered);
      setFormData({
        ...formData,
        fkid_municipality: ''
      });
    }
  };

  const handleCancel = () => {
    resetForm();
    setModalVisible(false); // Cierra el modal al cancelar
  };

  const resetForm = () => {
    setFormData({
      id_client: '',
      name_client: '',
      lastname_client: '',
      fkid_municipality: '',
      phone: '',
      created_at: '',
      updated_at: '',
      id: null,
      fkid_state: '' 
    });
    setUpdateData(null);
    setFilteredMunicipalities([]); 
  };
  ///////////////////////////////////////////////////////
 
  const municipalityMap = municipalities.reduce((acc, municipality) => {
    acc[municipality.id_municipality] = municipality.name;
    return acc;
  }, {});
    
  // Filtrar usuarios por cédula y nombre
    const filteredClients = clients.filter(client => {
      return (
        client.name_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastname_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id_client.includes(searchTerm)
      );
    });

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
            <h2>Lista de Clientes</h2>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className='mb-4'>
          <CCardHeader style={{display:"flex", alignItems:"center"}}>
              <CIcon icon={cilSearch}/>
               <CFormInput
                  type="text"
                  placeholder = "Buscar por cédula o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '300px', marginLeft:"10px",marginRight:"600px"}} // Ajusta el ancho según sea necesario
               />
               <CButton color="primary" onClick={() => setModalVisible(true)}>
                  <CIcon icon={cilUserPlus} />
                </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Cédula</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Apellido</CTableHeaderCell>
                    <CTableHeaderCell>Teléfono</CTableHeaderCell>
                    <CTableHeaderCell>Municipio</CTableHeaderCell>
                    <CTableHeaderCell>Fecha de Creación</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredClients.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="8">No hay datos</CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <CTableRow key={client.id}>
                        <CTableDataCell>{client.id_client}</CTableDataCell>
                        <CTableDataCell>{client.name_client}</CTableDataCell>
                        <CTableDataCell>{client.lastname_client}</CTableDataCell>
                        <CTableDataCell>{client.phone}</CTableDataCell>
                        <CTableDataCell>{municipalityMap[client.fkid_municipality] || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{new Date(client.created_at).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell style={{display:"flex",justifyContent:"flex-end"}}>
                          <CButton className="update" onClick={() => { setUpdateData(client); setModalVisible(true); }}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton className="delete" onClick={() => {deleteClient(client.id); setModalVisible2(true);}}>
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
                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
            <div className={`modal modal-lg modal fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none', margin: '0 auto' }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{updateData ? "Actualizar Cliente" : "Registrar Nuevo Cliente"}</h5>
                    <button type="button" className="btn-close" onClick={handleCancel} aria-label="Close"></button>
                  </div>
                  <div className ="modal-body">
                  <CForm onSubmit={handleSubmit}>
                    <CRow className='mt-3'>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="id_client"
                          name="id_client"
                          label="Cédula"
                          placeholder="Ingrese la cédula del cliente"
                          onChange={handleChange}
                          value={formData.id_client}
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="name_client"
                          name="name_client"
                          label="Nombre"
                          placeholder="Ingrese el nombre"
                          onChange={handleChange}
                          value={formData.name_client}
                          required
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mt-3">
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="lastname_client"
                          name="lastname_client"
                          label="Apellido"
                          placeholder="Ingrese el apellido"
                          onChange={handleChange}
                          value={formData.lastname_client}
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect
                          id="fkid_state"
                          name="fkid_state"
                          label="Estado"
                          onChange={handleChange}
                          value={formData.fkid_state}
                          required
                        >
                          <option value="">Seleccione un estado...</option>
                          {states.map(state => (
                            <option key={state.id_state} value={state.id_state}>{state.name}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                    <CRow className="mt-3 mb-3">
                      <CCol md={6}>
                        <CFormSelect
                          id="fkid_municipality"
                          name="fkid_municipality"
                          label="Municipio"
                          onChange={handleChange}
                          value={formData.fkid_municipality}
                          required
                        >
                          <option value="">Seleccione un municipio...</option>
                          {filteredMunicipalities.map(municipality => (
                            <option key={municipality.id_municipality} value={municipality.id_municipality}>{municipality.name}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="tel"
                          id="phone"
                          name="phone"
                          label="Teléfono"
                          placeholder="Ingrese el teléfono"
                          onChange={handleChange}
                          value={formData.phone}
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

export default AClients;