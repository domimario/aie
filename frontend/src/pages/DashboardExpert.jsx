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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  const [suggestedStatus, setSuggestedStatus] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await api.get("/api/applications/my");
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
  if (!note.trim()) {
    toast.warning("Ju lutem shkruani shënimin.");
    return;
  }

  try {
    const res = await api.post(
      `/api/applications/${selectedApp._id}/add-note`,
      {
        text: note,
        suggestedStatus: suggestedStatus || null,
      }
    );
    toast.success("Shënimi u shtua me sukses!");
    setNote("");
    setSuggestedStatus("");
    setShowDetail(false);
    fetchMyApplications();
  } catch (err) {
    toast.error("Gabim në shtimin e shënimit!");
    console.error("Error adding note:", err);
  }
};

// Edit note
const handleEditNote = async (noteId, newText) => {
  if (!newText.trim()) return;

  try {
    const res = await api.put(
      `/api/applications/${selectedApp._id}/edit-note/${noteId}`,
      { text: newText }
    );
    toast.info("Shënimi u përditësua!");
    fetchMyApplications();
  } catch (err) {
    toast.error("Gabim në editimin e shënimit!");
    console.error("Error editing note:", err);
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
            <h2 className="text-success">{Object.keys(stats.byStatus).length}</h2>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm p-3">
            <h6 className="text-muted">Bashki</h6>
            <h2 className="text-success">{Object.keys(stats.byMunicipality).length}</h2>
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
            <th>Emri</th>
            <th>Mbiemri</th>
            <th>Bashkia</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.projectTitle}</td>
              <td>{app.firstName}</td>
              <td>{app.lastName}</td>
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

      {/* Modal Detaje dhe Notes */}
<Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Detajet e Projektit</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedApp && (
      <>
        {/* ---------------- Detajet e Projektit ---------------- */}
        <Card className="mb-3 p-3 text-black">
          <p><b>Titulli:</b> {selectedApp.projectTitle}</p>
          <p><b>Përshkrimi:</b> {selectedApp.description}</p>
          <p><b>Fushat:</b> {selectedApp.innovationFields.join(", ")}</p>
          <p><b>Statusi:</b> <Badge bg="info">{selectedApp.status}</Badge></p>
        </Card>

        {/* ---------------- Shënimet ekzistuese ---------------- */}
        <h6>Shënimet e mëparshme</h6>
        {selectedApp.notes && selectedApp.notes.length > 0 ? (
          selectedApp.notes.map((n) => (
            <Card key={n._id} className="border mb-2 p-2">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <b>{n.user.name} ({n.fromRole})</b>{" "}
                  <small className="text-muted">
                    {new Date(n.date).toLocaleString()}
                  </small>
                  {n.suggestedStatus && (
                    <Badge bg="warning" className="ms-2">
                      {n.suggestedStatus}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Editable vetëm për ekspertin e caktuar */}
              {selectedApp.assignedExpert === n.user._id ? (
                <Form.Control
                  type="text"
                  defaultValue={n.text}
                  className="mt-2"
                  onBlur={(e) => handleEditNote(n._id, e.target.value)}
                />
              ) : (
                <p className="mt-2">{n.text}</p>
              )}
            </Card>
          ))
        ) : (
          <p>Nuk ka shënime të mëparshme.</p>
        )}

        {/* ---------------- Shto një shënim të ri ---------------- */}
        <hr />
        <Form.Group className="mb-2">
          <Form.Label>Shto një shënim të ri</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Status i sugjeruar (opsional)</Form.Label>
          <Form.Select
            value={suggestedStatus}
            onChange={(e) => setSuggestedStatus(e.target.value)}
          >
            <option value="">Zgjidh Status</option>
            <option value="I Ri">I Ri</option>
            <option value="Në Progres">Në Progres</option>
            <option value="Në Mentorim">Në Mentorim</option>
            <option value="Në Prezantim">Në Prezantim</option>
            <option value="Në Implementim">Në Implementim</option>
            <option value="Zbatuar">Zbatuar</option>
          </Form.Select>
        </Form.Group>
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

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
