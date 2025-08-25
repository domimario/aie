import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/axiosConfig"; 

// Options
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

// Validation
const validationSchema = Yup.object({
  firstName: Yup.string().required("Emri është i detyrueshëm"),
  lastName: Yup.string().required("Mbiemri është i detyrueshëm"),
  email: Yup.string().email("Email i pavlefshëm").required("Email është i detyrueshëm"),
  phone: Yup.string().required("Telefoni është i detyrueshëm"),
  projectTitle: Yup.string().required("Titulli i projektit është i detyrueshëm"),
  description: Yup.string().min(100, "Përshkrimi duhet të ketë të paktën 100 karaktere").required("Përshkrimi është i detyrueshëm"),
  innovationFields: Yup.array().min(1, "Zgjidh të paktën një fushë inovacioni"),
  ageGroup: Yup.string().required("Zgjidh një grupmoshë"),
  municipality: Yup.string().required("Zgjidh një bashki"),
});

const Apply = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "650px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-primary fw-bold">
            Formulari i Aplikimit
          </h2>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              projectTitle: "",
              description: "",
              innovationFields: [],
              ageGroup: "",
              municipality: "",
              prototypeUrl: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              try {
                const formData = new FormData();

                // Append all fields
                Object.keys(values).forEach(key => {
                  if (key === "innovationFields") {
                    values.innovationFields.forEach(field => 
                      formData.append("innovationFields", field)
                    );
                  } else {
                    formData.append(key, values[key]);
                  }
                });

                // Append files
                selectedFiles.forEach(file => {
                  formData.append("documents", file);
                });

                await api.post("/applications/submit", formData, {
                    headers: {
                       "Content-Type": "multipart/form-data", // since you're sending files
                      },
                });

                toast.success("Aplikimi u dërgua me sukses!");
                resetForm();
                setSelectedFiles([]);
              } catch (error) {
                console.error("Submission error:", error);
                toast.error("Gabim: " + (error.response?.data?.message || "Server error"));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form>
                {/* First Name */}
                <div className="mb-3">
                  <label className="form-label">Emri</label>
                  <Field type="text" name="firstName" className="form-control" />
                  <ErrorMessage name="firstName" component="div" className="text-danger small" />
                </div>

                {/* Last Name */}
                <div className="mb-3">
                  <label className="form-label">Mbiemri</label>
                  <Field type="text" name="lastName" className="form-control" />
                  <ErrorMessage name="lastName" component="div" className="text-danger small" />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger small" />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label">Telefoni</label>
                  <Field type="text" name="phone" className="form-control" />
                  <ErrorMessage name="phone" component="div" className="text-danger small" />
                </div>

                {/* Project Title */}
                <div className="mb-3">
                  <label className="form-label">Titulli i Projektit</label>
                  <Field type="text" name="projectTitle" className="form-control" />
                  <ErrorMessage name="projectTitle" component="div" className="text-danger small" />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Përshkrimi i Projektit (min 100 karaktere)</label>
                  <Field as="textarea" name="description" rows="4" className="form-control" />
                  <div className="form-text">
                    {values.description.length}/100 karaktere
                  </div>
                  <ErrorMessage name="description" component="div" className="text-danger small" />
                </div>

                {/* Innovation Fields */}
                <div className="mb-3">
                  <label className="form-label">Fusha e Inovacionit</label>
                  <Select
                    isMulti
                    options={innovationFields}
                    classNamePrefix="select"
                    onChange={selected => 
                      setFieldValue(
                        "innovationFields", 
                        selected ? selected.map(s => s.value) : []
                      )
                    }
                    value={innovationFields.filter(option => 
                      values.innovationFields.includes(option.value)
                    )}
                    placeholder="Zgjidh fushat"
                  />
                  <ErrorMessage name="innovationFields" component="div" className="text-danger small" />
                </div>

                {/* Age Group */}
                <div className="mb-3">
                  <label className="form-label">Grupmosha</label>
                  <Select
                    options={ageGroups}
                    classNamePrefix="select"
                    onChange={selected => 
                      setFieldValue("ageGroup", selected ? selected.value : "")
                    }
                    value={ageGroups.find(option => option.value === values.ageGroup)}
                    placeholder="Zgjidh grupmoshën"
                  />
                  <ErrorMessage name="ageGroup" component="div" className="text-danger small" />
                </div>

                {/* Municipality */}
                <div className="mb-3">
                  <label className="form-label">Bashkia</label>
                  <Select
                    options={municipalities}
                    classNamePrefix="select"
                    onChange={selected => 
                      setFieldValue("municipality", selected ? selected.value : "")
                    }
                    value={municipalities.find(option => option.value === values.municipality)}
                    placeholder="Zgjidh bashkinë"
                  />
                  <ErrorMessage name="municipality" component="div" className="text-danger small" />
                </div>

                {/* Prototype URL */}
                <div className="mb-3">
                  <label className="form-label">URL e prototipit (opsionale)</label>
                  <Field type="url" name="prototypeUrl" className="form-control" placeholder="https://..." />
                </div>

                {/* Documents */}
                <div className="mb-3">
                  <label className="form-label">Ngarko Dokumente (max 5)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="form-control"
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      if (files.length > 5) {
                        toast.error("Mund të ngarkoni maksimumi 5 dokumente!");
                        return;
                      }
                      setSelectedFiles(files);
                    }}
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <small>Dokumentet e zgjedhur: {selectedFiles.map(f => f.name).join(", ")}</small>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Duke dërguar..." : "Dërgo Aplikimin"}
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