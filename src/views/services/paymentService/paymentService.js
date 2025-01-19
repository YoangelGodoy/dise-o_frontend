import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const paymentService = [
    { id:'001', idCard: '30987654', idService:'001', date:'2023-05-01', status:'Pendiente', method:'Transferencia',  mount:'750', descrip:'Pago'},
    { id:'002', idCard: '30932654', idService:'002', date:'2023-06-01', status:'Completado', method:'Efectivo',  mount:'520', descrip:'Servicio remolque carro'},
  ]

 function paymentServices() {
  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Registro de Pagos de Clientes</h2>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="idCard"
                    name="idCard"
                    label='Cédula del Cliente'
                    placeholder='Ingresa la Cédula del Cliente'
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="idService"
                    name="idService"
                    label='ID de Servicio'
                    placeholder='Ingresa el ID del Servicio'
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="paymentDate"
                    name="paymentDate"
                    label='Fecha de Pago'
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    id="status"
                    name="status"
                    label='Status'
                  >
                    <option value="">Seleccione...</option>
                    <option value="completado">Completado</option>
                    <option value="pendiente">Pendiente</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    id="paymentMethod"
                    name="paymentMethod"
                    label='Método de Pago'
                    placeholder='Ingresa el Metodo de Pago'
                  >
                    <option value="">Seleccione...</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    id="mount"
                    name="mount"
                    label='Monto'
                    placeholder='Ingresa el Monto'
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormTextarea
                    id="description"
                    name="description"
                    label="Descripcion"
                    rows={3}
                  />
                </CCol>
              </CRow>
              <CButton type="submit" color="primary">
                Registrar Pago
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Historial de Pagos</h2>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ID Servicio</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Método de Pago</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Monto</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {paymentService.map((payment) => (
                            <CTableRow>
                            <CTableDataCell>{payment.id}</CTableDataCell>
                            <CTableDataCell>{payment.idCard}</CTableDataCell>
                            <CTableDataCell>{payment.idService}</CTableDataCell>
                            <CTableDataCell>{payment.date}</CTableDataCell>
                            <CTableDataCell>{payment.status}</CTableDataCell>
                            <CTableDataCell>{payment.method}</CTableDataCell>
                            <CTableDataCell>{payment.mount}</CTableDataCell>
                            <CTableDataCell>{payment.descrip}</CTableDataCell>
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

export default paymentServices