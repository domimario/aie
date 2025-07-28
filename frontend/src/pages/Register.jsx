import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Ekspert", 
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Regjistrimi u krye me sukses!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Ndodhi një gabim gjatë regjistrimit!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          <Card className="p-4 shadow-lg" style={{ minWidth: "380px" }}>
            <h2 className="text-center mb-4 gradient-text">Krijo Llogari</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Emri</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Shkruaj emrin"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="shembull@email.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fjalëkalimi</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Zgjidh një fjalëkalim"
                  minLength="6"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Roli</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="Ekspert">Ekspert</option>
                  <option value="Executive">Executive</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Duke regjistruar..." : "Regjistrohu"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
