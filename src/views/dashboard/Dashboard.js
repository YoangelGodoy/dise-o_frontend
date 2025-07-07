import { useState, useEffect } from "react"
import { helpFetch } from "../../components/helpers/helpFetch"
import "../../views/dashboard/dashboard-styles.css"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CButton,
  CProgress,
  CBadge,
  CAlert
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilPeople,
  cilUser,
  cilBell,
  cilFile,
  cilChart,
  cilSpeedometer,
  cilStar,
  cilPaperclip,
  cilCarAlt,
} from "@coreui/icons"
import { Link } from "react-router-dom"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
)

const Dashboard = () => {
  const api = helpFetch()
  const [stats, setStats] = useState({
    citizens: 0,
    vehicles: 0,
    users: 0,
    citationRequests: 0,
    movingPermits: 0,
    certificates: 0,
  })

  const [loading, setLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          citizensResponse,
          vehiclesResponse,
          usersResponse,
          citationRequestsResponse,
          movingPermitsResponse,
          lifeCertificatesResponse,
          permanentSeatsResponse,
          goodBehaviorsResponse,
        ] = await Promise.all([
          api.get("citizen"),
          api.get("vehicles"),
          api.get("users"),
          api.get("citationRequests"),
          api.get("movingPermits"),
          api.get("lifeCertificateRequests"),
          api.get("permanentSeatCertificates"),
          api.get("goodbehaviorCertificates"),
        ])

        const newStats = {
          citizens: citizensResponse.length || 0,
          vehicles: vehiclesResponse.length || 0,
          users: usersResponse.length || 0,
          citationRequests: citationRequestsResponse.length || 0,
          movingPermits: movingPermitsResponse.length || 0,
          certificates:
            (lifeCertificatesResponse.length || 0) +
            (permanentSeatsResponse.length || 0) +
            (goodBehaviorsResponse.length || 0),
        }

        setStats(newStats)
        setTotalRecords(Object.values(newStats).reduce((a, b) => a + b, 0))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [api])

  // Configuración de gráficas
  const barChartData = {
    labels: ["Ciudadanos", "Vehículos", "Usuarios", "Citaciones", "Permisos", "Constancias"],
    datasets: [
      {
        label: "Registros",
        data: [
          stats.citizens,
          stats.vehicles,
          stats.users,
          stats.citationRequests,
          stats.movingPermits,
          stats.certificates,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const doughnutData = {
    labels: ["Ciudadanos", "Vehículos", "Usuarios", "Citaciones", "Permisos", "Constancias"],
    datasets: [
      {
        data: [
          stats.citizens,
          stats.vehicles,
          stats.users,
          stats.citationRequests,
          stats.movingPermits,
          stats.certificates,
        ],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FFCE56", "#FF6384", "#9966FF", "#FF9F40"],
        borderWidth: 3,
        borderColor: "#fff",
        hoverBorderWidth: 5,
        cutout: "60%",
      },
    ],
  }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: false,
          padding: 20,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
      },
    },
  }

  // Componente de Card Mejorada
  const StatsCard = ({ link, title, value, subtitle, color, icon, }) => (
    <CCol sm={6} lg={4} className="mb-4">
      <CCard className={`stats-card border-0 shadow-lg h-100 card-hover bg-gradient-${color}`}>
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="stats-icon-wrapper">
              <div className={`stats-icon bg-white text-${color} shadow-sm`}>
                <CIcon icon={icon} size="xl" />
              </div>
            </div>
          </div>

          <div className="stats-content text-white">
            <h2 className="stats-number mb-2">{value.toLocaleString()}</h2>
            <h6 className="stats-title mb-2 text-white-75">{title}</h6>
            <p className="stats-subtitle mb-3 text-white-50">{subtitle}</p>

            <div className="progress-section mb-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-white-75">Progreso</small>
                <small className="text-white-75">
                  {totalRecords > 0 ? Math.round((value / totalRecords) * 100) : 0}%
                </small>
              </div>
              <CProgress
                value={totalRecords > 0 ? (value / totalRecords) * 100 : 0}
                color="light"
                height={6}
                className="progress-modern"
              />
            </div>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  )

  if (loading) {
    return (
      <CContainer className="mt-4">
        <CCard className="shadow-lg">
          <CCardBody className="text-center p-5">
            <p className="mt-3 fs-5">Cargando datos del dashboard...</p>
          </CCardBody>
        </CCard>
      </CContainer>
    )
  }

  return (
    <CContainer className="mt-4">
      {/* Header mejorado */}
      <CCard className="shadow-lg mb-4 border-0 header-card">
        <CCardHeader className="bg-gradient-primary text-white border-0 p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2 display-6 fw-bold">
                <CIcon icon={cilSpeedometer} className="me-3" />
                Panel de Control
              </h1>
              <p className="mb-0 fs-5 opacity-75">Sistema de Gestión Municipal</p>
            </div>
            <div className="text-end">
              <CBadge color="success" className="status-badge p-3 fs-6">
                <CIcon icon={cilStar} className="me-2" />
                Sistema Activo
              </CBadge>
            </div>
          </div>
        </CCardHeader>
        <CCardBody className="bg-light p-4">
          <div className="summary-section">
            <div className="row align-items-center">
              <div className="col-md-8">
                <CAlert color="info" className="mb-0 border-0 alert-modern">
                  <div className="d-flex align-items-center">
                    <div className="alert-icon me-3">
                      <CIcon icon={cilChart} size="lg" />
                    </div>
                    <div>
                      <h4 className="alert-title mb-1">Total de registros: {totalRecords.toLocaleString()}</h4>
                      <p className="mb-0">Registros activos en el sistema municipal</p>
                    </div>
                  </div>
                </CAlert>
              </div>
              <div className="col-md-4 text-center">
                <div className="total-counter">
                  <h2 className="counter-number text-primary mb-1">{totalRecords.toLocaleString()}</h2>
                  <small className="text-muted fw-semibold">TOTAL GENERAL</small>
                  <CProgress className="mt-2" value={100} color="primary" height={8} animated />
                </div>
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* Cards de estadísticas mejoradas */}
      <CRow className="mb-4">
        <StatsCard
          title="Ciudadanos"
          value={stats.citizens}
          subtitle="Ciudadanos Registrados"
          color="info"
          icon={cilPeople}
        />
        <StatsCard
          title="Vehículos"
          value={stats.vehicles}
          subtitle="Vehículos Registrados"
          color="success"
          icon={cilCarAlt}
        />
        <StatsCard
          title="Usuarios"
          value={stats.users}
          subtitle="Usuarios del Sistema"
          color="warning"
          icon={cilUser}
        />
        <StatsCard
          title="Citaciones"
          value={stats.citationRequests}
          subtitle="Solicitudes de Citación"
          color="danger"
          icon={cilBell}
        />
        <StatsCard
          title="Permisos"
          value={stats.movingPermits}
          subtitle="Permisos de Mudanza"
          color="primary"
          icon={cilPaperclip}
        />
        <StatsCard
          title="Constancias"
          value={stats.certificates}
          subtitle="Constancias Emitidas"
          color="dark"
          icon={cilFile}
        />
      </CRow>

      {/* Sección de gráficas */}
      <CRow className="mb-4">
        {/* Gráfico de barras */}
        <CCol lg={8}>
          <CCard className="shadow-lg border-0 h-100 chart-card">
            <CCardHeader className="bg-gradient-info text-white border-0 p-4">
              <h4 className="mb-0 fw-semibold">
                <CIcon icon={cilChart} className="me-2" />
                Distribución de Registros por Categoría
              </h4>
            </CCardHeader>
            <CCardBody className="p-4">
              <div style={{ height: "350px" }}>
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Gráfico circular */}
        <CCol lg={4}>
          <CCard className="shadow-lg border-0 h-100 chart-card">
            <CCardHeader className="bg-gradient-success text-white border-0 p-4">
              <h4 className="mb-0 fw-semibold">
                <CIcon icon={cilChart} className="me-2" />
                Proporción de Servicios
              </h4>
            </CCardHeader>
            <CCardBody className="p-4">
              <div style={{ height: "350px" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Acciones rápidas mejoradas */}
      <CCard className="shadow-lg border-0 actions-card">
        <CCardHeader className="bg-gradient-primary text-white border-0 p-4">
          <h4 className="mb-0 fw-semibold">
            <CIcon icon={cilStar} className="me-2" />
            Acciones Rápidas
          </h4>
        </CCardHeader>
        <CCardBody className="p-4">
          <CRow>
            <CCol md={4} className="mb-3">
              <Link to="/movingPermit" className="text-decoration-none">
                <div className="action-card bg-gradient-info text-white p-4 rounded shadow-sm h-100">
                  <div className="text-center">
                    <CIcon icon={cilCarAlt} size="3xl" className="mb-3" />
                    <h5 className="fw-bold">Solicitar un Permiso</h5>
                    <p className="mb-0 opacity-75">Solicita un Permiso de Mudanza</p>
                  </div>
                </div>
              </Link>
            </CCol>
            <CCol md={4} className="mb-3">
              <Link to="/vehicle" className="text-decoration-none">
                <div className="action-card bg-gradient-success text-white p-4 rounded shadow-sm h-100">
                  <div className="text-center">
                    <CIcon icon={cilUser} size="3xl" className="mb-3" />
                    <h5 className="fw-bold">Registrar Vehículo</h5>
                    <p className="mb-0 opacity-75">Agregar nuevo vehículo al registro</p>
                  </div>
                </div>
              </Link>
            </CCol>
            <CCol md={4} className="mb-3">
              <Link to="/citation" className="text-decoration-none">
                <div className="action-card bg-gradient-success text-white p-4 rounded shadow-sm h-100">
                  <div className="text-center">
                    <CIcon icon={cilPaperclip} size="3xl" className="mb-3" />
                    <h5 className="fw-bold">Solicitar una Citacion</h5>
                    <p className="mb-0 opacity-75">Solicita una Citacion</p>
                  </div>
                </div>
              </Link>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Dashboard
