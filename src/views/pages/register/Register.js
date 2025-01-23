import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser , cilPhone, cilCreditCard, cilShieldAlt } from '@coreui/icons';
import { helpFetch } from '../../../components/helpers/helpFetch';
const Register = () => {
  const api = helpFetch();
  const [formData, setFormData] = useState({
    idCard: '',
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    repeatPassword: '',
    rol_id: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.repeatPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const options = { body: { 
        idCard: formData.idCard, 
        name: formData.name, 
        lastName: formData.lastName, 
        phone: formData.phone, 
        email: formData.email, 
        password: formData.password, 
        rol_id: formData.rol_id 
      }};
      const response = await api.post('users', options);

      if (!response.error) {
        setSuccessMessage('Usuario registrado con éxito');

        setFormData({
          idCard: '',
          name: '',
          lastName: '',
          phone: '',
          email: '',
          password: '',
          repeatPassword: '',
          rol_id: '',
        });
      } else {
        setErrorMessage('Error al registrar el usuario');
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="login-background d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Registrar Usuario</h1>
                  <p className="text-body-secondary">Crea tu cuenta</p>
                  
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilCreditCard} />
                    </CInputGroupText>
                    <CFormInput
                      name="idCard"
                      placeholder="Cédula"
                      autoComplete="idCard"
                      value={formData.idCard}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser } />
                    </CInputGroupText>
                    <CFormInput
                      name="name"
                      placeholder="Nombre"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser } />
                    </CInputGroupText>
                    <CFormInput
                      name="lastName"
                      placeholder="Apellido"
                      autoComplete="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Teléfono"
                      autoComplete="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="repeatPassword"
                      placeholder="Repetir Contraseña"
                      autoComplete="new-password"
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                  <CInputGroupText>
                      <CIcon icon={cilShieldAlt} />
                    </CInputGroupText>
                  <CFormSelect
                    name="rol_id"
                    value={formData.rol_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione su rol...</option>
                    <option value="1">Administrador</option>
                    <option value="2">Empleado</option>
                    <option value="3">Ciudadano</option>
                  </CFormSelect>
                  </CInputGroup>
                  

                  {errorMessage && <p className="text-danger">{errorMessage}</p>}
                  {successMessage && <p className="text-success">{successMessage}</p>}

                  <div className="d-grid">
                    <CButton color="primary" type="submit">Crear Cuenta</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;