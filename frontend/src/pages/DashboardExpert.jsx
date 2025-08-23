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
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Card, Badge } from "react-bootstrap";

const COLORS = ["#36A2EB", "#4BC0C0", "#FF6384", "#FFCE56"];

const DashboardExpert = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byField: {},
    byStatus: {},
    byMunicipality: {},
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await api.get("/applications/my");
      console.log("Expert Applications from Backend:", res.data);

      setApplications(res.data);

      
      const total = res.data.length;
      const byField = {};
      const byStatus = {};
      const byMunicipality = {};

      res.data.forEach((app) => {
        app.innovationFields.forEach((f) => {
          byField[f] = (byField[f] || 0) + 1;
        });
        byStatus[app.status] = (byStatus[app.status] || 0) + 1;
        byMunicipality[app.municipality] =
          (byMunicipality[app.municipality] || 0) + 1;
      });

      setStats({ total, byField, byStatus, byMunicipality });
    } catch (err) {
      console.error("Error fetching expert apps:", err);
    }
  };

  const handleAddNote = async () => {
    try {
      const res = await api.post(`/applications/${selectedApp._id}/add-note`, {
        note,
      });
      console.log("Note added:", res.data);
      alert("Shënimi u shtua me sukses!");
      setShowDetail(false);
      fetchMyApplications();
    } catch (err) {
      console.error("Error adding note:", err);
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
      <h1 className="mb-4 text-center text-success fw-bold">
        Dashboard Ekspert
      </h1>

      
      <div className="row text-center mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm p-3">
            <h6 className="text-muted">Totali Projekteve</h6>
            <h2 className="text-success">{stats.total}</h2>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm p-3">
            <h6 className="text-muted">Statuset</h6>
            <h2 className="text-success">
              {Object.keys(stats.byStatus).length}
            </h2>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm p-3">
            <h6 className="text-muted">Bashki</h6>
            <h2 className="text-success">
              {Object.keys(stats.byMunicipality).length}
            </h2>
          </Card>
        </div>
      </div>

      
      <div className="row mb-5">
        <div className="col-md-6">
          <h5 className="text-center text-muted">Sipas Statusit</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatChartData(stats.byStatus)}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {formatChartData(stats.byStatus).map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-6">
          <h5 className="text-center text-muted">Sipas Fushës</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatChartData(stats.byField)}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="mb-3"> Projektet e mia</h3>
      <table className="table table-hover table-bordered shadow-sm">
        <thead className="table-success">
          <tr>
            <th>Titulli</th>
            <th>Aplikanti</th>
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
              <td>{app.municipality}</td>
              <td>
                <Badge bg="info">{app.status}</Badge>
              </td>
              <td>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowDetail(true);
                  }}
                >
                  Detaje / Shënim
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detajet e Projektit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <div>
              <p>
                <b>Titulli:</b> {selectedApp.projectTitle}
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

              <Form.Group className="mt-3">
                <Form.Label>Shto një shënim për këtë projekt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>
            Mbyll
          </Button>
          <Button variant="success" onClick={handleAddNote}>
            Ruaj Shënimin
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardExpert;
