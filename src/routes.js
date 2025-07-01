import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/users'))
const citizen = React.lazy(() => import ('./views/records/citizen/Citizens'))

const Login = React.lazy(() => import ('./views/pages/login/Login')) 
const register = React.lazy(() => import ('./views/pages/register/Register')) 
const citation = React.lazy(() => import ('./views/citation/citation')) 
const life = React.lazy(() => import ('./views/Certificates/proof_of_life')) 
const seat = React.lazy(() => import ('./views/Certificates/permanent_seat')) 
const behavior = React.lazy(() => import ('./views/Certificates/good_behavior')) 
const listCertificates = React.lazy(() => import ('./views/Certificates/listCertificates')) 
const movingPermit = React.lazy(() => import ('./views/permissions/moving_permit')) 
const list_movingPermit = React.lazy(() => import ('./views/permissions/list_movingPermit')) 
const vehicle = React.lazy(() => import ('./views/records/vehicles')) 
const listCitation = React.lazy(() => import ('./views/citation/listCitation')) 

const routes = [
  { path: '/', exact: true, name: 'Home', element: Login},
  { path: '/register', exact: true, name: 'Registro', element: register},
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/ciudadano', name:'Ciudadanos', element: citizen },
  { path: '/citation', name:'Citacion', element: citation},
  { path: '/listCitation', name:'Lista de Citaciones', element: listCitation},
  { path: '/life', name:'Fe de Vida', element: life},
  {path: '/seat', name:'Asiento Permanente', element: seat},
  {path: '/behavior', name:'Buena Conducta', element: behavior},
  {path: '/listCertificates', name:'Lista de Constancias', element: listCertificates},
  {path: '/movingPermit', name:'Permiso de Mudanza', element: movingPermit},
  {path: '/listMovingPermit', name:'Lista de Permisos de Mudanza', element: list_movingPermit},
  {path: '/vehicle', name:'Vehiculos', element: vehicle}
]

export default routes
