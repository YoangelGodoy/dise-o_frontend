import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/users'))
const AClients = React.lazy(() => import ('./views/client/Clients'))
const ADrivers = React.lazy(() => import ('./views/drivers/add_drivers/Drivers')) 
const paymentsDriver = React.lazy(() => import ('./views/drivers/payments/paymentsDriver')) 
const GTowTrucks = React.lazy(() => import ('./views/towTrucks/TowTrucks')) 
const addService = React.lazy(() => import ('./views/services/add/addService')) 
const listServices = React.lazy(() => import ('./views/services/list/listServices')) 
const paymentService = React.lazy(() => import ('./views/services/paymentService/paymentService')) 
const Login = React.lazy(() => import ('./views/pages/login/Login')) 


const routes = [
  { path: '/', exact: true, name: 'Home', element: Login},
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/drivers/add_drivers' ,  name: 'Drivers', element: ADrivers },
  { path: '/drivers/payments' ,  name: 'payments', element: paymentsDriver },
  { path: '/client', name:'Clients', element: AClients },
  { path: '/towTrucks', name:'TowTrucks', element: GTowTrucks  },
  { path: '/services/add', name:'addService', element: addService  },
  { path: '/services/list', name:'Services', element: listServices},
  { path: '/services/paymentService', name:'paymentService', element: paymentService},
]

export default routes
