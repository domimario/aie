import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const municipalities = [
  { value: "Tiranë", label: "Tiranë" },
  { value: "Durrës", label: "Durrës" },
  { value: "Shkodër", label: "Shkodër" },
  { value: "Elbasan", label: "Elbasan" },
  { value: "Vlorë", label: "Vlorë" },
];

const ageGroups = [
  { value: "Nxënës (15-18)", label: "Nxënës (15-18)" },
  { value: "Studentë (19-24)", label: "Studentë (19-24)" },
  { value: "Profesionistë (25-29)", label: "Profesionistë (25-29)" },
];

const innovationFields = [
  { value: "Fusha e Arsimit, Sportit dhe Politikës së Jashtme", label: "Arsimi & Sporti" },
  { value: "Fusha e Buqësisë, Veterinarisë dhe Zhvillim Rural", label: "Bujqësi & Rural" },
  { value: "Fusha e Drejtësisë dhe Sigurisë", label: "Drejtësi & Siguri" },
  { value: "Fusha e Financave Publike", label: "Financa Publike" },
  { value: "Fusha e Infrastrukturës dhe Energjisë", label: "Infrastrukturë & Energjia" },
  { value: "Fusha e Shëndetësisë dhe mbrojtja sociale", label: "Shëndetësi & Sociale" },
  { value: "Fusha e Turizmit dhe Mjedisit", label: "Turizëm & Mjedisi" },
  { value: "Fusha e Zhvillimit Ekonomik, Kulturor, Inovacion", label: "Ekonomi & Inovacion" },
  { value: "Fusha nën Përgjegjesinë e Kryeministrit", label: "Kryeministria" },
];

const validationSchema = Yup.object({
  fullName: Yup.string().required("Emri është i detyrueshëm"),
  email: Yup.string().email("Email i pavlefshëm").required("Email është i detyrueshëm"),
  phone: Yup.string().required("Telefoni është i detyrueshëm"),
  projectTitle: Yup.string().required("Titulli i projektit është i detyrueshëm"),
  description: Yup.string()
    .min(100, "Përshkrimi duhet të ketë të paktën 100 karaktere")
    .required("Përshkrimi është i detyrueshëm"),
  innovationFields: Yup.array()
    .min(1, "Zgjidh të paktën një fushë inovacioni")
    .required("Zgjidh një fushë inovacioni"),
  ageGroup: Yup.string().required("Zgjidh një grupmoshë"),
  municipality: Yup.string().required("Zgjidh një bashki"),
});

const Apply = () => {
  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-primary fw-bold">
            Formulari i Aplikimit
          </h2>
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              phone: "",
              projectTitle: "",
              description: "",
              innovationFields: [],
              ageGroup: "",
              municipality: "",
              prototypeUrl: "",
              documents: [],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                  if (key === "documents") {
                    values.documents.forEach((file) => formData.append("documents", file));
                  } else if (key === "innovationFields") {
                    values.innovationFields.forEach((field) =>
                      formData.append("innovationFields", field)
                    );
                  } else {
                    formData.append(key, values[key]);
                  }
                });

                await axios.post(
                  "http://localhost:5000/api/applications/submit",
                  formData,
                  { headers: { "Content-Type": "multipart/form-data" } }
                );

                toast.success(" Aplikimi u dërgua me sukses!");
                resetForm();
              } catch (error) {
                toast.error(
                  "Gabim: " + (error.response?.data?.message || "Server error")
                );
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                {/* Emri i plotë */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Emri i plotë
                  </label>
                  <Field
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="form-control"
                    placeholder="Emri i plotë"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Telefoni */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Telefoni
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    className="form-control"
                    placeholder="Telefoni"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Titulli i Projektit */}
                <div className="mb-3">
                  <label htmlFor="projectTitle" className="form-label">
                    Titulli i Projektit
                  </label>
                  <Field
                    type="text"
                    name="projectTitle"
                    id="projectTitle"
                    className="form-control"
                    placeholder="Titulli i Projektit"
                  />
                  <ErrorMessage
                    name="projectTitle"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Përshkrimi */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Përshkrimi i Projektit (min 100 karaktere)
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    className="form-control"
                    rows="4"
                    placeholder="Përshkrimi i Projektit (min 100 karaktere)"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Fusha e Inovacionit */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Fusha e Inovacionit</label>
                  <Select
                    isMulti
                    options={innovationFields}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selected) =>
                      setFieldValue(
                        "innovationFields",
                        selected ? selected.map((s) => s.value) : []
                      )
                    }
                    placeholder="Zgjidh fushat"
                  />
                  <ErrorMessage
                    name="innovationFields"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Grupmosha */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Grupmosha</label>
                  <Select
                    options={ageGroups}
                    classNamePrefix="select"
                    onChange={(selected) =>
                      setFieldValue("ageGroup", selected ? selected.value : "")
                    }
                    placeholder="Zgjidh grupmoshën"
                  />
                  <ErrorMessage
                    name="ageGroup"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Bashkia */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Bashkia</label>
                  <Select
                    options={municipalities}
                    classNamePrefix="select"
                    onChange={(selected) =>
                      setFieldValue("municipality", selected ? selected.value : "")
                    }
                    placeholder="Zgjidh bashkinë"
                  />
                  <ErrorMessage
                    name="municipality"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* URL Prototipi */}
                <div className="mb-3">
                  <label htmlFor="prototypeUrl" className="form-label">
                    URL e prototipit (opsionale)
                  </label>
                  <Field
                    type="url"
                    name="prototypeUrl"
                    id="prototypeUrl"
                    className="form-control"
                    placeholder="https://..."
                  />
                  <ErrorMessage
                    name="prototypeUrl"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Dokumentet */}
                <div className="mb-3">
                  <label htmlFor="documents" className="form-label">
                    Ngarko Dokumente (max 5)
                  </label>
                  <input
                    id="documents"
                    name="documents"
                    type="file"
                    className="form-control"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(event) => {
                      const files = Array.from(event.currentTarget.files);
                      if (files.length > 5) {
                        toast.error("Mund të ngarkoni maksimumi 5 dokumente!");
                        return;
                      }
                      setFieldValue("documents", files);
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Dergo Aplikimin
                </button>
              </Form>
            )}
          </Formik>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Apply;
