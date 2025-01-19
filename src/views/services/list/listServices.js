import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'

const serviceTow = [
  {
    id: '001',
    idCard_client: '12345678',
    idCard_driver: '87654321',
    tuitionTruck: 'ABC123',
    cost: 150.00,
    typeVehicle: 'carro',
    status: 'Completado',
    descrip: 'Servicio de grúa por avería en carretera'
  },
  {
    id: '002',
    idCard_client: '23456789',
    idCard_driver: '98765432',
    tuitionTruck: 'XYZ789',
    cost: 200.00,
    typeVehicle: 'camion',
    status: 'En Proceso',
    descrip: 'Remolque de camión accidentado'
  },
  {
    id: '003',
    idCard_client: '23456789',
    idCard_driver: '98765432',
    tuitionTruck: 'XYZ789',
    cost: 200.00,
    typeVehicle: 'camion',
    status: 'Pendiente',
    descrip: 'Remolque de camión accidentado'
  },
]

const ColorStatus = (status) => {
  switch (status) {
    case 'Pendiente':
      return 'warning'
    case 'En Proceso':
      return 'info'
    case 'Completado':
      return 'success'
    default:
      return 'secondary'
  }
}

function listServices() {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h2>Lista de Servicios de Grúa</h2>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chofer</CTableHeaderCell>
              <CTableHeaderCell scope="col">Matrícula</CTableHeaderCell>
              <CTableHeaderCell scope="col">Costo</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {serviceTow.map((service) => (
              <CTableRow key={service.id}>
                <CTableDataCell>{service.id}</CTableDataCell>
                <CTableDataCell>{service.idCard_client}</CTableDataCell>
                <CTableDataCell>{service.idCard_driver}</CTableDataCell>
                <CTableDataCell>{service.tuitionTruck}</CTableDataCell>
                <CTableDataCell>${service.cost.toFixed(2)}</CTableDataCell>
                <CTableDataCell>{service.typeVehicle}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={ColorStatus(service.status)}>
                    {service.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{service.descrip}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default listServices