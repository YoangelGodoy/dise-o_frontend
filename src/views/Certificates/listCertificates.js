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
  CFormInput,
  CFormSelect,
  CModal,         // Importar CModal
  CModalHeader,   // Importar CModalHeader
  CModalTitle,    // Importar CModalTitle
  CModalBody,     // Importar CModalBody
  CModalFooter,   // Importar CModalFooter
  CButton,        // Importar CButton para el modal
} from "@coreui/react"
import { cilSearch } from "@coreui/icons"
import { CIcon } from "@coreui/icons-react"

const ConstanciaList = () => {
  const api = helpFetch()
  const [constancias, setConstancias] = useState([])
  const [filterDate, setFilterDate] = useState("")
  const [filterName, setFilterName] = useState("")
  const [filterType, setFilterType] = useState("")

  // Estados para el modal de error
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchConstancias = async () => {
      try {
        const [lifeCertificates, permanentSeats, goodBehaviors] = await Promise.all([
          api.get("lifeCertificateRequests"),
          api.get("permanentSeatCertificates"),
          api.get("goodbehaviorCertificates"),
        ])

        const allRequests = [
          ...lifeCertificates.map((cert) => ({ ...cert, type: "Fe de Vida" })),
          ...permanentSeats.map((cert) => ({
            ...cert,
            type: "Asiento Permanente",
            name: cert.deceasedName ? cert.deceasedName.split(" ")[0] : '', // Manejar posible undefined
            lastName: cert.deceasedName ? cert.deceasedName.split(" ").slice(1).join(" ") : '', // Manejar posible undefined
          })),
          ...goodBehaviors.map((cert) => ({
            ...cert,
            type: "Buena Conducta",
            name: cert.citizenName ? cert.citizenName.split(" ")[0] : '', // Manejar posible undefined
            lastName: cert.citizenName ? cert.citizenName.split(" ").slice(1).join(" ") : '', // Manejar posible undefined
          })),
        ]
        const updatedConstancias = allRequests.map((constancia) => {
          const requestDate = new Date(constancia.requestDate)
          const dueDate = new Date(requestDate)
          dueDate.setDate(requestDate.getDate() + 2)
          return { ...constancia, dueDate: dueDate.toISOString(), status: constancia.status || "Pendiente" }
        })
        setConstancias(updatedConstancias)
      } catch (error) {
        setErrorMessage("Error al cargar las constancias: " + error.message)
        setShowErrorModal(true)
      }
    }

    fetchConstancias()
  }, [api])

  const filteredConstancias = constancias.filter((constancia) => {
    const matchesDate = filterDate ? new Date(constancia.dueDate).toISOString().split("T")[0] === filterDate : true
    const matchesName = filterName
      ? (constancia.name && constancia.name.toLowerCase().includes(filterName.toLowerCase())) ||
        (constancia.lastName && constancia.lastName.toLowerCase().includes(filterName.toLowerCase()))
      : true
    const matchesType = filterType ? constancia.type === filterType : true
    return matchesDate && matchesName && matchesType
  })

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Lista de Constancias</h2>
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
          <CFormSelect
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: "200px", marginLeft: "10px" }}
          >
            <option value="">Todos</option>
            <option value="Fe de Vida">Fe de Vida</option>
            <option value="Asiento Permanente">Asiento Permanente</option>
            <option value="Buena Conducta">Buena Conducta</option>
          </CFormSelect>
        </CCardHeader>
        <CCardBody>
          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Apellido</CTableHeaderCell>
                <CTableHeaderCell>Fecha Límite</CTableHeaderCell>
                <CTableHeaderCell>Tipo de Constancia</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredConstancias.map((constancia) => (
                <CTableRow key={constancia.id}>
                  <CTableDataCell>{constancia.name}</CTableDataCell>
                  <CTableDataCell>{constancia.lastName}</CTableDataCell>
                  <CTableDataCell>{new Date(constancia.dueDate).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>{constancia.type}</CTableDataCell>
                  <CTableDataCell>{constancia.status}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

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

export default ConstanciaList
