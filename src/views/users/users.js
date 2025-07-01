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
import { cilPencil, cilTrash, cilUserPlus, cilSearch} from '@coreui/icons'; 

const AUsers = () => {
  const api = helpFetch();
  const [updateData, setUpdateData] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [modalVisible2, setModalVisible2] = useState(false); // Estado para el modal de eliminación
  const [userToDelete, setUsersToDelete] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    api.get("users").then((response) => {
      if (!response.error) setUsers(response);
    });
  }, []);

  const addUser  = (user) => {
    const options = { body: user };

    api.post("users", options).then((response) => {
      if (!response.error) setUsers([...users, response]);
    });
  };

  const updateUser  = (user) => {
    const options = { body: { ...user, updated_at: new Date().toISOString() } };

    api.put("users", options, user.id).then((response) => {
      if (!response.error) {
        const newUsers = users.map(el => el.id === user.id ? response : el);
        setUsers(newUsers);
        setUpdateData(null);
      }
    });
  };

  const deleteUser  = (id) => {
    setUsersToDelete(id); // Guarda el id del cliente a eliminar
    setModalVisible2(true); // Muestra el modal de eliminación
  };

  const confirmDelete = () => {
    if (userToDelete) {
      api.delet("users", userToDelete).then((response) => {
        if (!response.error) {
          const newUsers = users.filter(el => el.id !== String(userToDelete));
          setUsers(newUsers);
        }
      });
    }
    setModalVisible2(false); // Cierra el modal de eliminación
    setUsersToDelete(null); // Resetea el cliente a eliminar
  };

  const cancelDelete = () => {
    setModalVisible2(false); // Cierra el modal de eliminación sin hacer nada
    setUsersToDelete(null); // Resetea el cliente a eliminar
  };

  const [formData, setFormData] = useState({
    id: '',
    idCard: '',
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    rol_id: '',
  });

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
      updateUser (formData);
    } else {
      formData.id = Date.now().toString();
      addUser (formData);
      resetForm();
    }
    setModalVisible(false); // Cierra el modal después de agregar o actualizar
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    resetForm();
    setModalVisible(false); // Cierra el modal al cancelar
  };

  const resetForm = () => {
    setFormData({
      id: '',
      idCard: '',
      name: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      rol_id: '',
    });
    setUpdateData(null);
  };

  // Filtrar usuarios por cédula y nombre
  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.idCard.includes(searchTerm)
    );
  });
  // Denifinir roles por id 
  const roles = (role_id) =>{
    switch(role_id){
      case "1":
        return "Administrador";
      case "2":
        return "Empleado";
      case "3":
        return "Ciudadano";
    }
  };

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className='bg-primary text-white'>
          <h2>Lista de Usuarios</h2>
        </CCardHeader>
      </CCard>
      <CRow>
        <CCol>
          <CCard className='mb-4 shadow-sm'>
            <CCardHeader style={{display:"flex", alignItems:"center"}}>
                <CIcon icon={cilSearch}/>
                  <CFormInput
                    type="text"
                    placeholder = "Buscar por cédula o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px', marginLeft:"10px",marginRight:"600px"}} // Ajusta el ancho según sea necesario
                  />
                  <CButton color="success" onClick={() => setModalVisible(true)}>
                    <CIcon icon={cilUserPlus} style={{ color: 'white' }}/>
                  </CButton>
              </CCardHeader>
            <CCardBody>
              <CTable hover responsive className='custom-table'>
                <CTableHead className='table-light'>
                  <CTableRow>
                    <CTableHeaderCell>Cédula</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Apellido</CTableHeaderCell>
                    <CTableHeaderCell>Teléfono</CTableHeaderCell>
                    <CTableHeaderCell>Correo Electrónico</CTableHeaderCell>
                    <CTableHeaderCell>rol</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredUsers.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="7">No hay datos</CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <CTableRow key={user.id}>
                        <CTableDataCell>{user.idCard}</CTableDataCell>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.lastName}</CTableDataCell>
                        <CTableDataCell>{user.phone}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>{roles(user.rol_id)}</CTableDataCell>
                        <CTableDataCell style={{display:"flex",justifyContent:"flex-end"}}>
                            <CButton className="update" onClick={() => { setUpdateData(user); setModalVisible(true); }}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton className="delete" onClick={() => deleteUser(user.id)}>
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
              <button type="button" style={{backgroundColor:"red"}} className="btn btn-danger text-white" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal modal-lg ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none', margin: '0 auto' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{updateData ? "Actualizar Usuario" : "Registrar Nuevo Usuario"}</h5>
              <button type="button" className="btn-close" onClick={handleCancel} aria-label="Close"></button>
            </div>
            <div className ="modal-body">
              <CForm onSubmit={handleSubmit}>
                <CRow className='mt-3'>
                  <CCol>
                    <CFormSelect
                      id="rol_id"
                      name="rol_id"
                      label="rol"
                      onChange={handleChange}
                      value={formData.rol_id}
                      required
                    >
                      <option value="">Seleccione su rol...</option>
                      <option value="1">Administrador</option>
                      <option value="2">Empleado</option>
                      <option value="3">Ciudadano</option>
                    </CFormSelect>
                  </CCol>  
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="idCard"
                      name="idCard"
                      label="Cédula"
                      placeholder="Ingrese la cédula del usuario"
                      onChange={handleChange}
                      value={formData.idCard}
                      required
                    />
                  </CCol>  
                </CRow>
                <CRow className='mt-3'>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      label="Nombre"
                      placeholder="Ingrese el nombre"
                      onChange={handleChange}
                      value={formData.name}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="lastName"
                      name="lastName"
                      label="Apellido"
                      placeholder="Ingrese el apellido"
                      onChange={handleChange}
                      value={formData.lastName}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
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
                  <CCol md={6}>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      label="Correo Electrónico"
                      placeholder="Ingrese el correo electrónico"
                      onChange={handleChange}
                      value={formData.email}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3 mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="password"
                      id="password"
                      name="password"
                      label="Contraseña"
                      placeholder="Ingrese la contraseña" 
                      onChange={handleChange}
                      value={formData.password}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton type="submit" className="bg-primary mt-3 bottoms">
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

export default AUsers;