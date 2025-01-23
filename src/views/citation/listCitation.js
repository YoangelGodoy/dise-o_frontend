import React, { useState, useEffect } from "react";
import { helpFetch } from "../../components/helpers/helpFetch";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton
} from "@coreui/react";

const CitationRequestList = () => {
  const api = helpFetch();
  const [citationRequests, setCitationRequests] = useState([]);

  useEffect(() => {
    const fetchCitationRequests = async () => {
      const response = await api.get("citationRequests");
      if (!response.error) {
     
        const updatedRequests = response.map(request => {
          const requestDate = new Date(request.requestDate);
          const dueDate = new Date(requestDate);
          dueDate.setDate(requestDate.getDate()+2);
          return { ...request, dueDate: dueDate.toISOString() }; 
        });
        setCitationRequests(updatedRequests);
      } else {
        alert("Error al cargar las solicitudes de citación.");
      }
    };

    fetchCitationRequests();
  }, []);

  const handleDelete = async (id) => {
    console.log("id", id)
    const response = await api.delet("citationRequests", id);
    if (!response.error) {
      setCitationRequests(citationRequests.filter(request => request.id !== id));
      alert("Solicitud de citación eliminada con éxito.");
    } else {
      alert("Error al eliminar la solicitud de citación.");
    }
  };

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Lista de Solicitudes de Citación</h2>
        </CCardHeader>
        <CCardBody>
          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Apellido</CTableHeaderCell>
                <CTableHeaderCell>Fecha Límite</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {citationRequests.map((request) => (
                <CTableRow key={request.id}>
                  <CTableDataCell>{request.id}</CTableDataCell>
                  <CTableDataCell>{request.name}</CTableDataCell>
                  <CTableDataCell>{request.lastName}</CTableDataCell>
                  <CTableDataCell>{new Date(request.dueDate).toLocaleDateString()}</CTableDataCell> 
                  <CTableDataCell>
                    <CButton color="danger" className="text-white" onClick={() => handleDelete(request.id)}>
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default CitationRequestList;