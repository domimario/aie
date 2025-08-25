import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/axiosConfig";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation before request
    if (!form.email || !form.password) {
      toast.warn("Ju lutem plotësoni të gjitha fushat!");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/users/login", form);

      // Save token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        })
      );

      toast.success(`Hyrje e suksesshme, ${res.data.name}!`);

      // Navigate based on role after short delay
      setTimeout(() => {
        if (res.data.role === "Executive") {
          navigate("/dashboard-executive");
        } else if (res.data.role === "Ekspert") {
          navigate("/dashboard-ekspert");
        } else {
          toast.error("Roli i panjohur! Kontakto administratorin.");
        }
      }, 1200);

    } catch (err) {
      // Handle specific errors
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Email ose fjalëkalimi i gabuar!");
        } else if (err.response.status === 500) {
          toast.error("Gabim serveri. Provoni përsëri më vonë.");
        } else {
          toast.error(err.response.data.message || "Diçka shkoi gabim!");
        }
      } else {
        toast.error("Nuk mund të lidheni me serverin. Kontrolloni lidhjen.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-3 gradient-text">Hyr në Platformë</h3>
        <p className="text-center text-muted mb-4">Për Ekspertë dhe Ekzekutivë</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Shkruaj emailin"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Fjalëkalimi</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Shkruaj fjalëkalimin"
              required
              disabled={loading}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Duke hyrë...
              </>
            ) : (
              "Hyr"
            )}
          </Button>
        </Form>
      </Card>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </Container>
  );
};

export default Login;
