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
} from "@coreui/react"
import { cilCheck, cilTrash, cilSearch, cilDataTransferDown } from "@coreui/icons"
import { CIcon } from "@coreui/icons-react"

const MovingPermitList = () => {
  const api = helpFetch()
  const [movingPermits, setMovingPermits] = useState([])
  const [filterDate, setFilterDate] = useState("")
  const [filterName, setFilterName] = useState("")

  useEffect(() => {
    const fetchMovingPermits = async () => {
      const response = await api.get("movingPermits")
      if (!response.error) {
        const updatedPermits = response.map((permit) => {
          const requestDate = new Date(permit.requestDate)
          const dueDate = new Date(requestDate)
          dueDate.setDate(requestDate.getDate() + 2)
          return { ...permit, dueDate: dueDate.toISOString(), status: permit.status || "Pendiente" }
        })
        setMovingPermits(updatedPermits)
      } else {
        alert("Error al cargar los permisos de mudanza.")
      }
    }

    fetchMovingPermits()
  }, [api.get])

  const handleDelete = async (id) => {
    const response = await api.delet("movingPermits", id)
    if (!response.error) {
      setMovingPermits(movingPermits.filter((permit) => permit.id !== id))
      alert("Permiso de mudanza eliminado con éxito.")
    } else {
      alert("Error al eliminar el permiso de mudanza.")
    }
  }

  const handleChangeStatus = async (id) => {
    const permit = movingPermits.find((p) => p.id === id)
    if (!permit) return

    const nextStatus = getNextStatus(permit.status)
    const updatedPermit = { ...permit, status: nextStatus }

    const options = { body: updatedPermit }
    const response = await api.put("movingPermits", options, id)

    if (!response.error) {
      setMovingPermits(movingPermits.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)))
      alert("Estado del permiso actualizado con éxito.")
    } else {
      alert("Error al actualizar el estado del permiso.")
    }
  }

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "Pendiente") {
      return "Listo"
    } else if (currentStatus === "Listo") {
      return "Entregado"
    }
    return currentStatus
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

  const filteredPermits = movingPermits.filter((permit) => {
    const matchesDate = filterDate ? new Date(permit.dueDate).toISOString().split("T")[0] === filterDate : true
    const matchesName = permit.userName.toLowerCase().includes(filterName.toLowerCase())
    return matchesDate && matchesName
  })

  return (
    <CContainer>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h2>Lista de Permisos de Mudanza</h2>
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
                <CTableHeaderCell>Municipio de Salida</CTableHeaderCell>
                <CTableHeaderCell>Lugar de Llegada</CTableHeaderCell>
                <CTableHeaderCell>Fecha Límite</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredPermits.map((permit) => (
                <CTableRow key={permit.id}>
                  <CTableDataCell>{permit.userName}</CTableDataCell>
                  <CTableDataCell>{permit.municipalityDeparture}</CTableDataCell>
                  <CTableDataCell>{permit.arrivalPlace}</CTableDataCell>
                  <CTableDataCell>{new Date(permit.dueDate).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>{permit.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color={getButtonColor(permit.status)}
                      className="text-white"
                      onClick={() => handleChangeStatus(permit.id)}
                      disabled={permit.status === "Entregado"}
                      style={{ marginRight: "7px" }}
                    >
                      <CIcon icon={cilCheck} />
                    </CButton>
                    <CButton
                      color="danger"
                      className="text-white"
                      onClick={() => handleDelete(permit.id)}
                      style={{ marginRight: "7px" }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton color="primary" className="text-white">
                      <CIcon icon={cilDataTransferDown} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default MovingPermitList

