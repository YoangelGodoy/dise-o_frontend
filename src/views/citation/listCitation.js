import { useState, useEffect } from "react"
import { helpFetch } from "../../components/helpers/helpFetch"
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
  CButton,
  CFormInput,
  CModal,         // Importar CModal
  CModalHeader,   // Importar CModalHeader
  CModalTitle,    // Importar CModalTitle
  CModalBody,     // Importar CModalBody
  CModalFooter,   // Importar CModalFooter
} from "@coreui/react"
import { cilCheck, cilTrash, cilSearch, cilCloudDownload, cilDataTransferDown } from "@coreui/icons"
import { CIcon } from "@coreui/icons-react"

const CitationRequestList = () => {
  const api = helpFetch()
  const [citationRequests, setCitationRequests] = useState([])
  const [filterDate, setFilterDate] = useState("")
  const [filterName, setFilterName] = useState("")

  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)

  // Estados para el modal de estado
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [currentStatusMessage, setCurrentStatusMessage] = useState("")

  // Estados para el modal de error general
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchCitationRequests = async () => {
      const response = await api.get("citationRequests")
      if (!response.error) {
        const updatedRequests = response.map((request) => {
          const requestDate = new Date(request.requestDate)
          const dueDate = new Date(requestDate)
          dueDate.setDate(requestDate.getDate() + 2)
          return { ...request, dueDate: dueDate.toISOString(), status: request.status || "Pendiente" } // Asegurar "Pendiente" con mayúscula inicial
        })
        setCitationRequests(updatedRequests)
      } else {
        setErrorMessage("Error al cargar las solicitudes de citación.")
        setShowErrorModal(true)
      }
    }

    fetchCitationRequests()
  }, [api]) // Removed api.get from dependencies, api is stable

  const handleDelete = async () => {
    const response = await api.delet("citationRequests", selectedRequestId)
    if (!response.error) {
      setCitationRequests(citationRequests.filter((request) => request.id !== selectedRequestId))
      setModalMessage("Solicitud de citación eliminada con éxito.")
      setShowStatusModal(true) // Reutilizamos el modal de estado para mensajes de éxito
    } else {
      setErrorMessage("Error al eliminar la solicitud de citación.")
      setShowErrorModal(true)
    }
    setShowDeleteModal(false) // Cerrar el modal de confirmación de eliminación
    setSelectedRequestId(null) // Limpiar el ID seleccionado
  }

  const handleChangeStatus = async (id) => {
    const request = citationRequests.find((req) => req.id === id)
    if (!request) return

    const nextStatus = getNextStatus(request.status)
    const updatedRequest = { ...request, status: nextStatus }

    const options = { body: updatedRequest }
    const response = await api.put("citationRequests", options, id)

    if (!response.error) {
      setCitationRequests(citationRequests.map((req) => (req.id === id ? { ...req, status: nextStatus } : req)))
      setCurrentStatusMessage(`Estado de la solicitud actualizado a: ${nextStatus}.`)
      setShowStatusModal(true)
    } else {
      setErrorMessage("Error al actualizar el estado de la solicitud.")
      setShowErrorModal(true)
    }
  }

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "Pendiente") {
      return "Listo"
    } else if (currentStatus === "Listo") {
      return "Entregado"
    }
    return currentStatus // No cambiar si ya es "Entregado"
  }

  const getButtonColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "warning"
      case "Listo":
        return "info"
      case "Entregado":
        return "success"
      default:
        return "secondary"
    }
  }

  const filteredRequests = citationRequests.filter((request) => {
    const matchesDate = filterDate ? new Date(request.dueDate).toISOString().split("T")[0] === filterDate : true
    const matchesName =
      request.name.toLowerCase().includes(filterName.toLowerCase()) ||
      request.lastName.toLowerCase().includes(filterName.toLowerCase())
    return matchesDate && matchesName
  })

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Lista de Solicitudes de Citación</h2>
        </CCardHeader>
        <CCardHeader style={{ display: "flex", alignItems: "center" }}>
          <CIcon style={{ marginRight: "8px" }} icon={cilSearch} />
          <CFormInput
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ width: "200px", marginLeft: "10px" }}
          />
          <CFormInput
            type="text"
            placeholder="Filtrar por nombre"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            style={{ width: "200px", marginLeft: "10px" }}
          />
        </CCardHeader>
        <CCardBody>
          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Apellido</CTableHeaderCell>
                <CTableHeaderCell>Fecha Límite</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredRequests.map((request) => (
                <CTableRow key={request.id}>
                  <CTableDataCell>{request.name}</CTableDataCell>
                  <CTableDataCell>{request.lastName}</CTableDataCell>
                  <CTableDataCell>{new Date(request.dueDate).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>{request.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color={getButtonColor(request.status)}
                      className="text-white"
                      onClick={() => handleChangeStatus(request.id)}
                      disabled={request.status === "Entregado"} // Deshabilitar si ya está entregado
                      style={{ marginRight: "7px" }}
                    >
                      <CIcon icon={cilCheck} />
                    </CButton>
                    <CButton
                      color="danger"
                      className="text-white"
                      onClick={() => {
                        setSelectedRequestId(request.id)
                        setShowDeleteModal(true)
                      }}
                      style={{ marginRight: "7px" }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton
                      color="primary"
                      className="text-white"
                    >
                      <CIcon icon={cilDataTransferDown} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal de Confirmación de Eliminación */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader onClose={() => setShowDeleteModal(false)}>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>¿Estás seguro de que deseas eliminar esta solicitud de citación?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={handleDelete}>Eliminar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Estado de la Solicitud (para éxito o actualización de estado) */}
      <CModal visible={showStatusModal} onClose={() => setShowStatusModal(false)}>
        <CModalHeader onClose={() => setShowStatusModal(false)}>
          <CModalTitle>Estado de la Solicitud</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{currentStatusMessage}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowStatusModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Error General */}
      <CModal visible={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <CModalHeader onClose={() => setShowErrorModal(false)}>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{errorMessage}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowErrorModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default CitationRequestList
