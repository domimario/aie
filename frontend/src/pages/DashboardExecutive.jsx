import { useEffect, useState } from "react";
import api from "../utils/axiosConfig"; 
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#7C4DFF",
  "#E91E63",
];

const DashboardExecutive = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byAge: {},
    byField: {},
    byMunicipality: {},
    byStatus: {},
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [expertEmail, setExpertEmail] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);

     
      const total = res.data.length;
      const byAge = {};
      const byField = {};
      const byMunicipality = {};
      const byStatus = {};

      res.data.forEach((app) => {
        byAge[app.ageGroup] = (byAge[app.ageGroup] || 0) + 1;
        app.innovationFields.forEach((f) => {
          byField[f] = (byField[f] || 0) + 1;
        });
        byMunicipality[app.municipality] =
          (byMunicipality[app.municipality] || 0) + 1;
        byStatus[app.status] = (byStatus[app.status] || 0) + 1;
      });

      setStats({ total, byAge, byField, byMunicipality, byStatus });
    } catch (err) {
      console.error("Gabim në marrjen e aplikimeve:", err);
    }
  };

  const handleAssignExpert = async () => {
    try {
      await api.put(`/applications/${selectedApp._id}/assign-expert`, {
        expertEmail,
      });
      alert("Eksperti u caktua me sukses!");
      setShowAssign(false);
      fetchApplications();
    } catch (err) {
      console.error("Gabim caktimi eksperti:", err);
    }
  };

  const handleChangeStatus = async () => {
    try {
      await api.put(`/applications/${selectedApp._id}/status`, {
        status: newStatus,
      });
      alert("Statusi u ndryshua me sukses!");
      setShowStatus(false);
      fetchApplications();
    } catch (err) {
      console.error("Gabim ndryshimi statusi:", err);
    }
  };

  const formatChartData = (obj) =>
    Object.keys(obj).map((key, index) => ({
      name: key,
      value: obj[key],
      fill: COLORS[index % COLORS.length],
    }));

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Dashboard Ekzekutiv</h1>

      
      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Totali i Aplikimeve</h5>
            <h2>{stats.total}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Grupmosha</h5>
            <h2>{Object.keys(stats.byAge).length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Bashki</h5>
            <h2>{Object.keys(stats.byMunicipality).length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Statuset</h5>
            <h2>{Object.keys(stats.byStatus).length}</h2>
          </div>
        </div>
      </div>

      
      <div className="row mb-5">
        <div className="col-md-6">
          <h5 className="text-center">Sipas Grupmoshës</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatChartData(stats.byAge)}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {formatChartData(stats.byAge).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h5 className="text-center">Sipas Fushës</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatChartData(stats.byField)}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <h3 className="mb-3">Lista e Aplikimeve</h3>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Titulli</th>
            <th>Aplikanti</th>
            <th>Grupmosha</th>
            <th>Bashkia</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.projectTitle}</td>
              <td>{app.fullName}</td>
              <td>{app.ageGroup}</td>
              <td>{app.municipality}</td>
              <td>
                <span className="badge bg-info">{app.status}</span>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowDetail(true);
                  }}
                >
                  Detaje
                </button>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowAssign(true);
                  }}
                >
                  Cakto Ekspert
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowStatus(true);
                  }}
                >
                  Ndrysho Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Detaje */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detajet e Aplikimit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <div>
              <p>
                <b>Emri:</b> {selectedApp.fullName}
              </p>
              <p>
                <b>Email:</b> {selectedApp.email}
              </p>
              <p>
                <b>Telefon:</b> {selectedApp.phone}
              </p>
              <p>
                <b>Projekti:</b> {selectedApp.projectTitle}
              </p>
              <p>
                <b>Përshkrimi:</b> {selectedApp.description}
              </p>
              <p>
                <b>Fushat:</b> {selectedApp.innovationFields.join(", ")}
              </p>
              <p>
                <b>Statusi:</b> {selectedApp.status}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showAssign} onHide={() => setShowAssign(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cakto Ekspert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email i Ekspertit</Form.Label>
            <Form.Control
              type="email"
              value={expertEmail}
              onChange={(e) => setExpertEmail(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssign(false)}>
            Mbyll
          </Button>
          <Button variant="success" onClick={handleAssignExpert}>
            Cakto
          </Button>
        </Modal.Footer>
      </Modal>

     
      <Modal show={showStatus} onHide={() => setShowStatus(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ndrysho Statusin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Zgjidh Status</option>
            <option value="I Ri">I Ri</option>
            <option value="Në Progres">Në Progres</option>
            <option value="Në Mentorim">Në Mentorim</option>
            <option value="Në Prezantim">Në Prezantim</option>
            <option value="Në Implementim">Në Implementim</option>
            <option value="Zbatuar">Zbatuar</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatus(false)}>
            Mbyll
          </Button>
          <Button variant="warning" onClick={handleChangeStatus}>
            Ndrysho
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardExecutive;
