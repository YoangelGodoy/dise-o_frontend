import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
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

const paymentDriver = [
    { idCard_driver:'30780090', date:'2024-02-21', mount:'500', descrip:'pago mensual'},
    { idCard_driver:'30784590', date:'2024-11-21', mount:'600', descrip:'pago mensual'},

  ]

function paymentsDriver() {
  return (
    <CRow>
      <CCol md={9}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Registro de Pagos</h2>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    id="idCard_driver"
                    name="idCard_driver"
                    label="Cedula del Chofer"
                    placeholder='Ingrese la Cedula del Chofer'
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="datePayment"
                    name="datePayment"
                    label="Fecha del Pago"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    id="mount"
                    name="mount"
                    label='Monto'
                    placeholder='Ingrese el Monto'
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
      <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Historial de Pagos</h2>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Cédula del Chofer</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Fecha de Pago</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Monto</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {paymentDriver.map((payment) => (
                            <CTableRow>
                            <CTableDataCell>{payment.idCard_driver}</CTableDataCell>
                            <CTableDataCell>{payment.date}</CTableDataCell>
                            <CTableDataCell>${payment.mount}</CTableDataCell>
                            <CTableDataCell>{payment.descrip}</CTableDataCell>
                            </CTableRow>
                        ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      </CRow>
    </CRow>
  )
}

export default paymentsDriver