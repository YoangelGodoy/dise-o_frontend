import { element } from 'prop-types'
import React from 'react'

// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/users'))
const citizen = React.lazy(() => import ('./views/citizen/Citizens'))
// const ADrivers = React.lazy(() => import ('./views/drivers/add_drivers/Drivers')) 
// const paymentsDriver = React.lazy(() => import ('./views/drivers/payments/paymentsDriver')) 
// const addService = React.lazy(() => import ('./views/services/add/addService')) 
// const listServices = React.lazy(() => import ('./views/services/list/listServices')) 
// const paymentService = React.lazy(() => import ('./views/services/paymentService/paymentService')) 
const Login = React.lazy(() => import ('./views/pages/login/Login')) 
const register = React.lazy(() => import ('./views/pages/register/Register')) 
const citation = React.lazy(() => import ('./views/citation/citation')) 
const life = React.lazy(() => import ('./views/Certificates/proof_of_life')) 
const listCitation = React.lazy(() => import ('./views/citation/listCitation')) 

const routes = [
  { path: '/', exact: true, name: 'Home', element: Login},
  { path: '/register', exact: true, name: 'Registro', element: register},
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  // { path: '/drivers/add_drivers' ,  name: 'Drivers', element: ADrivers },
  // { path: '/drivers/payments' ,  name: 'payments', element: paymentsDriver },
  { path: '/ciudadano', name:'Ciudadanos', element: citizen },
  // { path: '/services/add', name:'addService', element: addService  },
  // { path: '/services/list', name:'Services', element: listServices},
  // { path: '/services/paymentService', name:'paymentService', element: paymentService},
  { path: '/citation', name:'Citacion', element: citation},
  { path: '/listCitation', name:'Lista de Citaciones', element: listCitation},
  { path: '/life', name:'Fe de Vida', element: life}
]

export default routes
