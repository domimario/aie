import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import api from "../utils/axiosConfig";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/login", form);

      
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

      
      if (res.data.role === "Executive") {
        navigate("/dashboard-executive");
      } else if (res.data.role === "Ekspert") {
        navigate("/dashboard-expert");
      } else {
        setError("Roli i panjohur! Kontakto administratorin.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email ose fjalëkalimi është i pasaktë!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-3 gradient-text">Hyr në Platformë</h3>
        <p className="text-center text-muted mb-4">Për Ekspertë dhe Ekzekutivë</p>

        {error && <Alert variant="danger">{error}</Alert>}

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
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading}
          >
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
    </Container>
  );
};

export default Login;
