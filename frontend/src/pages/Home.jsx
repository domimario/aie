// src/pages/HomePage.jsx
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import {
  Lightbulb,
  Users,
  Target,
  Rocket,
  Brain,
  Zap,
  Code,
  Smartphone,
  Database,
  Globe,
  HeartPulse,
  Scale,
  Leaf,
  Landmark,
  BookOpen,
} from "lucide-react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

export default function HomePage(){
    const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate("/apply"); // shkon tek forma
  };
  return (
    <div className="min-vh-100 bg-dark text-light">
      {/* Hero Section */}
      <section className="text-center py-5 bg-gradient-blue">
        <Container>
          <Badge bg="primary" className="mb-3 px-3 py-2">
            <Zap className="me-2" size={16} />
            Platforma Inovative për të Rinjtë
          </Badge>
          <h1 className="display-4 fw-bold text-white">
            GJENERATA E <span className="gradient-text">INOVACIONIT</span>
          </h1>
          <p className="lead text-light opacity-75 mt-3">
            Një platformë që i ofron të rinjve mundësinë të vendosin në jetë idetë e tyre inovatore për administratën publike.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Button variant="primary" size="lg" onClick={handleApplyClick}>
              <Rocket className="me-2" size={20} /> Apliko Tani
            </Button>
          </div>
        </Container>
      </section>

      {/* Qëllimi */}
      <section className="py-5 bg-dark">
        <Container>
          <h2 className="fw-bold text-center mb-4">Qëllimi i Programit</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Lightbulb size={40} className="mb-3 text-primary" />
                  <Card.Title>Nxitja e Inovacionit</Card.Title>
                  <Card.Text>
                    Frymëzim për të rinjtë që të zhvillojnë dhe ekzekutojnë idetë e tyre inovatore.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Users size={40} className="mb-3 text-success" />
                  <Card.Title>Ndërlidhja</Card.Title>
                  <Card.Text>
                    Bashkëpunim me Qendrat e Inovacionit dhe Ekselencës për zhvillimin e ideve.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Target size={40} className="mb-3 text-warning" />
                  <Card.Title>Promovimi</Card.Title>
                  <Card.Text>
                    Përkrahje e vazhdueshme për krijimtarinë, inovacionin dhe ekselencën.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Çfarë ofron */}
      <section className="py-5 bg-secondary bg-opacity-25">
        <Container>
          <h2 className="fw-bold text-center mb-4">Çfarë Ofron Programi?</h2>
          <p className="text-center text-light">
            Programi ofron një platformë për mbledhjen dhe zhvillimin e ideve inovatore të të rinjve 15-29 vjeç,
            me mentorim nga ekspertë dhe prezantim në Qendrat e Inovacionit dhe Ekselencës ose tek aktorët kryesorë.
          </p>
        </Container>
      </section>

      {/* Fushat e Veprimtarisë */}
      <section className="py-5 bg-dark">
        <Container>
          <h2 className="fw-bold text-center mb-5">Fushat e Veprimtarisë</h2>
          <Row className="g-4">
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Globe size={32} className="mb-3 text-info" />
                  <Card.Title>Zhvillimi Ekonomik</Card.Title>
                  <Card.Text>Ide për rritjen e biznesit dhe zhvillimin kombëtar.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <BookOpen size={32} className="mb-3 text-warning" />
                  <Card.Title>Arsimi & Rinia</Card.Title>
                  <Card.Text>Përmirësimi i sistemit arsimor dhe përfshirjes së rinisë.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <HeartPulse size={32} className="mb-3 text-danger" />
                  <Card.Title>Shëndetësia</Card.Title>
                  <Card.Text>Zgjidhje inovatore në kujdesin shëndetësor.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Scale size={32} className="mb-3 text-success" />
                  <Card.Title>Sundimi i Ligjit</Card.Title>
                  <Card.Text>Forcimi i transparencës dhe sundimit të ligjit.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Leaf size={32} className="mb-3 text-success" />
                  <Card.Title>Mjedisi & Turizmi</Card.Title>
                  <Card.Text>Mbrojtja e mjedisit dhe promovimi i turizmit të qëndrueshëm.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Landmark size={32} className="mb-3 text-primary" />
                  <Card.Title>Kultura & Arti</Card.Title>
                  <Card.Text>Promovimi i trashëgimisë kulturore dhe artit.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Code size={32} className="mb-3 text-info" />
                  <Card.Title>Teknologjia</Card.Title>
                  <Card.Text>Zhvillimi digjital për transformimin e administratës.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Database size={32} className="mb-3 text-warning" />
                  <Card.Title>Financat Publike</Card.Title>
                  <Card.Text>Menaxhim më i mirë i financave publike dhe burimeve.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Si funksionon */}
      <section className="py-5 bg-secondary bg-opacity-25">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Si Funksionon Programi?</h2>
            <p className="text-secondary">Një proces i thjeshtë në tre hapa për të realizuar idetë tuaja</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Lightbulb size={32} className="text-info mb-3" />
                  <Card.Title>1. Shqyrtimi</Card.Title>
                  <Card.Text>Ekspertët shqyrtojnë idetë e paraqitura.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Target size={32} className="text-warning mb-3" />
                  <Card.Title>2. Përzgjedhja</Card.Title>
                  <Card.Text>Idetë më të mira përzgjidhen për zhvillim.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark border-secondary h-100 text-center">
                <Card.Body>
                  <Brain size={32} className="text-success mb-3" />
                  <Card.Title>3. Mentorimi</Card.Title>
                  <Card.Text>Mentorim nga ekspertët për realizimin e idesë.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mënyrat e aplikimit */}
      <section className="py-5 bg-dark">
        <Container>
          <h2 className="fw-bold text-center mb-4">Mënyrat e Aplikimit</h2>
          <ul className="list-unstyled text-center fs-5">
            <li>Aplikimi Online në platformën zyrtare</li>
            <li>Aplikimi me Postë në adresën e Agjencisë së Inovacionit dhe Ekselencës</li>
            <li>
              Aplikimi me Email:{" "}
              <strong className="text-primary">shkelqe@aie.gov.al</strong>
            </li>
          </ul>
          <p className="text-center mt-4">
            Për çdo informacion të mëtejshëm, na kontaktoni tek{" "}
            <strong>pyet@aie.gov.al</strong>.
          </p>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-top border-secondary py-4">
        <Container className="text-center">
          <h5 className="fw-bold">GJENERATA E INOVACIONIT</h5>
          <p className="text-secondary">
            Një iniciativë e Ministrisë së Ekonomisë, Kulturës dhe Inovacionit, Ministrit të Shtetit për Rininë dhe UNICEF Albania
          </p>
          <small className="text-secondary">
            © 2024 Gjenerata e Inovacionit — Të gjitha të drejtat e rezervuara
          </small>
        </Container>
      </footer>
    </div>
  );
}
