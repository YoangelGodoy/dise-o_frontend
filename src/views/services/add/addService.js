import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CButton
} from '@coreui/react'

function addService() {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h2>Servicio de Grúa</h2>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput 
              type="text" 
              id="idCard_client" 
              name="idCard_client" 
              placeholder='Ingrese la cedula del Cliente'
              label="Cédula del Cliente"
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect id="typeVechicle" name="typeVehicle" label="Tipo de Vehiculo">
                <option value="">Seleccione...</option>
                <option value="motorcycle">Motocicleta</option>
                <option value="truck">Camión</option>
                <option value="car">Carro</option>
                <option value="autobus">Autobús</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput 
              type="text" 
              id="idCard_driver" 
              name="idCard_driver" 
              label="Cédula del Chofer"
              placeholder='Ingrese la Cédula del Chofer'
              />
            </CCol>
            <CCol md={6}>
              <CFormInput 
              type="text" 
              id="tuitionTruck" 
              name="tuitionTruck" 
              label="Matrícula de la Grúa"
              placeholder='Ingrese la Matrícula de la Grúa'
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput 
              type="number" 
              id="cost" 
              name="cost" 
              label="Costo"
              placeholder='Ingrese el Costo del Servicio'
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect id="status" name="status"label="Status">
                <option value="">Seleccione...</option>
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Proceso</option>
                <option value="completed">Completado</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormTextarea 
              id="description" 
              name="description" 
              label="Descripción"
              rows={3}>                
              </CFormTextarea>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CButton type="submit" color="primary">
                Guardar Servicio
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default addService