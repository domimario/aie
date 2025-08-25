import React, { useState } from "react";
import api from "../utils/axiosConfig";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CreateExpert() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // <-- for navigation

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/api/users/create-expert", form);
      setSuccess("Ekspert account created successfully!");
      setForm({ name: "", email: "", password: "" });

      // Navigate back to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard-executive");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating Ekspert!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ minWidth: "380px" }}>
        <h2 className="text-center mb-4">Register Ekspert</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
          </Form.Group>
          <Button type="submit" className="w-100">Create Ekspert</Button>
          <Button 
            variant="secondary" 
            className="w-100 mt-2" 
            onClick={() => navigate("/dashboard-executive")}
          >
            Back to Dashboard
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
