import React from 'react';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilExitToApp,
  cilSettings,
  cilTask,
  cilUser ,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import { helpFetch } from '../helpers/helpFetch';

const AppHeaderDropdown = () => {
  const navigate = useNavigate(); 

  const handleLockAccount = async () => {
    try {
      const api = helpFetch();
      const user = JSON.parse(localStorage.getItem('user'));
  
      if (user && user.id) {
        await api.delet("loggedInUsers", user.id);
        localStorage.removeItem('user');
        navigate('/');
      } else {
        console.error('Error: No se pudo encontrar el usuario o el ID del usuario.');
      }
    } catch (error) {
      console.error('Error al bloquear la cuenta:', error);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const initials = user ? (user.name.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')).toUpperCase() : '';

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar size="md" style={{ backgroundColor: '#004186de', color: '#fff', fontWeight: 'bold' }}>
          {initials}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Cuenta</CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLockAccount} href="#">
          <CIcon icon={cilExitToApp} className="me-2" />
          Salir
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
}

export default AppHeaderDropdown;