'use client'

import React, { useState, useEffect } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
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
  CAvatar,
} from '@coreui/react'
import { helpFetch } from '../../components/helpers/helpFetch'
import { cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const IntegratedDashboard = () => {
  const [drivers, setDrivers] = useState([])
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const api = helpFetch()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const driversResponse = await api.get("driver")
    if (!driversResponse.error) setDrivers(driversResponse)

    const clientsResponse = await api.get("client")
    if (!clientsResponse.error) setClients(clientsResponse)

    const usersResponse = await api.get("users")
    if (!usersResponse.error) {
      setUsers(usersResponse)
    }

  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Sistema de Gestión de Transporte</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={6} xl={3}>
                <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
                  <div className="text-medium-emphasis small">Choferes Registrados</div>
                  <div className="fs-5 fw-semibold">{drivers.length}</div>
                </div>
              </CCol>
              <CCol xs={12} md={6} xl={3}>
                <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                  <div className="text-medium-emphasis small">Clientes Registrados</div>
                  <div className="fs-5 fw-semibold">{clients.length}</div>
                </div>
              </CCol>
              <CCol xs={12} md={6} xl={3}>
                <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                  <div className="text-medium-emphasis small">Viajes Realizados</div>
                  <div className="fs-5 fw-semibold">0</div>
                </div>
              </CCol>
              <CCol xs={12} md={6} xl={3}>
                <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                  <div className="text-medium-emphasis small">Ingresos Totales</div>
                  <div className="fs-5 fw-semibold">0</div>
                </div>
              </CCol>
            </CRow>

            <CChartLine
              style={{ height: '300px', marginTop: '40px' }}
              data={{
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
                datasets: [
                  {
                    label: 'Viajes',
                    backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
                    borderColor: getStyle('--cui-info'),
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    borderWidth: 2,
                    data: [
                    ],
                    fill: true,
                  },
                  {
                    label: 'Ingresos',
                    backgroundColor: 'transparent',
                    borderColor: getStyle('--cui-success'),
                    pointHoverBackgroundColor: getStyle('--cui-success'),
                    borderWidth: 2,
                    data: [
                    ],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      stepSize: Math.ceil(250 / 5),
                      max: 250,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Usuarios del Sistema</strong>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead className="text-nowrap">
                <CTableRow>
                  <CTableHeaderCell className="bg-body-tertiary text-center">
                    <CIcon icon={cilPeople} />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Usuario</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Cédula</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Teléfono</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="text-center">
                      <CAvatar size="md" src={`https://ui-avatars.com/api/?name=${user.name}+${user.lastName}&background=random`} />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{user.name} {user.lastName}</div>
                      <div className="small text-body-secondary text-nowrap">
                        <span>{user.email}</span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{user.idCard}</CTableDataCell>
                    <CTableDataCell>{user.phone}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Últimos Choferes Registrados</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Cédula</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {drivers.slice(0, 5).map((driver) => (
                  <CTableRow key={driver.id}>
                    <CTableDataCell>{driver.id_driver}</CTableDataCell>
                    <CTableDataCell>{`${driver.name_driver} ${driver.lastname_driver}`}</CTableDataCell>
                    <CTableDataCell>{driver.phone}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Últimos Clientes Registrados</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Cédula</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {clients.slice(0, 5).map((client) => (
                  <CTableRow key={client.id}>
                    <CTableDataCell>{client.id_client}</CTableDataCell>
                    <CTableDataCell>{`${client.name_client} ${client.lastname_client}`}</CTableDataCell>
                    <CTableDataCell>{client.phone}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default IntegratedDashboard