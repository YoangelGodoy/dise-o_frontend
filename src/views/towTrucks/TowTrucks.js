import React, { useEffect, useState } from 'react';
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
import { cilPencil, cilPlus, cilSearch, cilTrash } from '@coreui/icons'; 
import { helpFetch } from '/src/components/helpers/helpFetch';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Imagen de la Grúa</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <img src={imageUrl} alt="Grúa" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const GTowTrucks = () => {
  const api = helpFetch();
  const [towTrucks, setTowTrucks] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [TowToDelete, setTowTrucksToDelete] = useState(null); 
  const [modalVisible2, setModalVisible2] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    const fetchTowTrucks = async () => {
      const response = await api.get("tow_truck");
      if (!response.error) setTowTrucks(response);
    };

    fetchTowTrucks();
  }, []);

  const [formData, setFormData] = useState({
    tuition: '',
    model: '',
    type_towtruck: '',
    status: '',
    image: '',
    id: null,
    created_at: '', 
    updated_at: '' 
  });

  useEffect(() => {
    if (updateData != null) {
      setFormData(updateData);
    } else {
      setFormData({
        tuition: '',
        model: '',
        type_towtruck: '',
        status: '',
        image: '',
        id: null,
        created_at: '',
        updated_at: ''
      });
    }
  }, [updateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    if (updateData != null) {
      formData.updated_at = currentDate; 
      await updateTowTruck(formData);
    } else {
      formData.created_at = currentDate; 
      formData.updated_at = currentDate; 
      formData.id = Date.now().toString(); 
      await addTowTruck(formData);
    }
    resetForm();
    setModalVisible(false);
  };

  const addTowTruck = async (add) => {
    const options = { body: add };
    const response = await api.post("tow_truck", options);
    if (!response.error) {
      setTowTrucks([...towTrucks, response ]); 
    }
  };

  const updateTowTruck = async (update) => {
    const options = { body: update };
    const response = await api.put("tow_truck", options, update.id); 
    if (!response.error) {
      const newTowTrucks = towTrucks.map(el => el.id === update.id ? response : el);
      setTowTrucks(newTowTrucks);
      setUpdateData(null);
    }
  };

  const deleteTowTruck = (id) => {
    setTowTrucksToDelete(id);
    setModalVisible2(true);
  };

  const confirmDelete = () => {
    if (TowToDelete) {
      api.delet("tow_truck", TowToDelete).then((response) => {
        if (!response.error) {
          const newTowTrucks = towTrucks.filter(el => el.id !== String(TowToDelete));
          setTowTrucks(newTowTrucks);
        }
      });
    }
    setModalVisible2(false);
    setTowTrucksToDelete(null);
  };

  const cancelDelete = () => {
    setModalVisible2(false);
    setTowTrucksToDelete(null);
  };

  const handleCancel = () => {
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setFormData({
      tuition: '',
      model: '',
      type_towtruck: '',
      status: '',
      image: '',
      id: null,
      created_at: '',
      updated_at: ''
    });
    setUpdateData(null);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredTowTrucks = towTrucks.filter(tow => {
    return (
      tow.tuition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tow.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tow.type_towtruck.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Lista de Grúas</h2>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader style={{ display: "flex", alignItems: "center" }}>
              <CIcon icon={cilSearch} />
              <CFormInput
                type="text"
                placeholder="Buscar por Matricula, modelo o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '350px', marginLeft: "10px", marginRight: "550px" }}
              />
              <CButton color="primary" onClick={() => setModalVisible(true)}>
                <CIcon icon={cilPlus} />
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Imagen</CTableHeaderCell> 
                    <CTableHeaderCell>Matrícula</CTableHeaderCell>
                    <CTableHeaderCell>Modelo</CTableHeaderCell>
                    <CTableHeaderCell>Estatus</CTableHeaderCell>
                    <CTableHeaderCell>Tipo</CTableHeaderCell>
                    <CTableHeaderCell>Fecha de Creación</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredTowTrucks.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="7">No hay datos</CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredTowTrucks.map((towtruck) => (
                      <CTableRow sytkey={towtruck.id}>
                        <CTableDataCell>
                          {towtruck.image && (
                            <img
                              src={towtruck.image}
                              alt="Grúa"
                              style={{ width: '70px', height: '50px', cursor: 'pointer' }}
                              onClick={() => {
                                setSelectedImageUrl(towtruck.image);
                                setModalImageVisible(true);
                              }}
                            />
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{towtruck.tuition}</CTableDataCell>
                        <CTableDataCell>{towtruck.model}</CTableDataCell>
                        <CTableDataCell>{towtruck.status}</CTableDataCell>
                        <CTableDataCell>{towtruck.type_towtruck}</CTableDataCell>
                        <CTableDataCell>{new Date(towtruck.created_at).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell style={{ height:"60px",display: "flex", justifyContent: "flex-end" }}>
                          <CButton className="update" onClick={() => { setUpdateData(towtruck); setModalVisible(true) }}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton className="delete" onClick={() => { deleteTowTruck(towtruck.id); setModalVisible2(true) }}>
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
              <button type="button" className="btn btn-danger" id="ConfirmDelete" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal modal-lg ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none', margin: '0 auto' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{updateData ? "Actualizar Grúa" : "Registrar Nueva Grúa"}</h5>
              <button type="button" className="btn-close" onClick={handleCancel} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <CForm onSubmit={handleSubmit}>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormInput
                      type='text'
                      id="tuition"
                      name="tuition"
                      label="Matrícula"
                      placeholder="Ingrese la Matrícula"
                      onChange={handleChange}
                      value={formData.tuition}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="model"
                      name="model"
                      label="Modelo"
                      placeholder="Ingrese el Modelo"
                      onChange={handleChange}
                      value={formData.model}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3 mb-3">
                  <CCol md={6}>
                    <CFormSelect id="type_towtruck" name="type_towtruck" label="Tipo de Grúa" onChange={handleChange} value={formData.type_towtruck} required>
                      <option value="">Seleccione...</option>
                      <option value="gancho">Gancho</option>
                      <option value="plataforma">Plataforma</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect id="status" name="status" label="Status" onChange={handleChange} value={formData.status} required>
                      <option value="">Seleccione...</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mt-3 mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      id="image"
                      name="image"
                      label="Subir Imagen"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    {formData.image && <img src={formData.image} alt="Vista previa" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
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
      <ImageModal
        isOpen={modalImageVisible}
        imageUrl={selectedImageUrl}
        onClose={() => setModalImageVisible(false)}
      />
    </CContainer>
  );
};

export default GTowTrucks;