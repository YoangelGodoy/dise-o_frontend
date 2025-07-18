import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser  } from '@coreui/icons';
import '../../../scss/_custom.scss';
import { helpFetch } from '../../../components/helpers/helpFetch';

const api = helpFetch();

const Login = () => {
  const [email, setEmail] = useState(''); // Cambiado de username a email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser  = localStorage.getItem('user');
    if (loggedInUser ) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const usersRes = await api.get("users");

      if (!usersRes.err) {
        // Cambiado username por email
        const user = usersRes.find(user => user.email === email && user.password === password);
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          const options = { body: user };
          await api.post("loggedInUsers", options);
          navigate('/dashboard');
        } else {
          setErrorMessage('Invalid email or password'); // Cambiado mensaje de error
        }
      } else {
        setErrorMessage('Error fetching user data');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="login-background d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <InputGroup
                      icon={cilUser }
                      placeholder="Email" // Cambiado de Username a Email
                      value={email} // Cambiado de username a email
                      onChange={(e) => setEmail(e.target.value)} // Cambiado de username a email
                    />
                    <InputGroup
                      icon={cilLockLocked}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' id="login" color="primary" className="px-4 bg-primary text-white" style={{ border: 'none' }}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary text-white" style={{width: '44%', border: 'none', paddingTop: "100px" }}>
                <CCardBody className="text-center">
                  <div className="text-center mb-4" style={{ display: "-ms-flexbox", justifyContent: "space-between" }}>
                    <h3>Regístrate con nosotros</h3>
                    <Link to="/register">
                      <CButton style={{ backgroundColor: "white", color: "black" }}>Crear una Cuenta</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

const InputGroup = ({ icon, placeholder, value, onChange, type = 'text' }) => (
  <CInputGroup className="mb-3">
    <CInputGroupText>
      <CIcon icon={icon} />
    </CInputGroupText>
    <CFormInput
      type={type}
      placeholder={placeholder}
      autoComplete={type === 'password' ? 'current-password' : 'username'}
      value={value}
      onChange={onChange}
    />
  </CInputGroup>
);

export default Login;
