import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilExitToApp } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import { helpFetch } from '../helpers/helpFetch';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  
  // 1. Definir las funciones ANTES de usarlas
  const handleLockAccount = async () => {
    try {
      const api = helpFetch();
      const user = JSON.parse(localStorage.getItem('user'));
  
      if (user?.id) {
        await api.delet("loggedInUsers", user.id);
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // 2. Definir las variables
  const user = JSON.parse(localStorage.getItem('user'));
  const initials = user?.name?.[0]?.toUpperCase() + (user?.lastName?.[0]?.toUpperCase() || '');

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar size="md" style={{ backgroundColor: '#2C3E50', color: '#fff', fontWeight: 'bold' }}>
          {initials || '?'}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Cuenta</CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLockAccount}>
          <CIcon icon={cilExitToApp} className="me-2" />
          Salir
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
