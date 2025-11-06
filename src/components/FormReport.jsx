import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const FormReport = ({ isOpen, onClose, report = null, updateReport = null }) => {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  // 🟢 Efecto para animación de entrada/salida
  useEffect(() => {
    setFadeIn(isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  // 🟢 Efecto para precargar datos si se está editando un reporte
  useEffect(() => {
    if (report) {
      setTitle(report.title || "");
      setCategory(report.category || "Seguridad");
      setDescription(report.description || "");
    } else {
      // Si es nuevo reporte, limpia campos
      setTitle("");
      setCategory("Seguridad");
      setDescription("");
    }
  }, [report]);

  // 🟢 Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No tienes permisos para crear un reporte.");
      return;
    }

    try {
      if (updateReport && report) {
        // 🟡 Modo edición
        updateReport({
          id: report.id,
          user_id: user.id,
          title,
          category,
          description,
          location: "Unknown location",
        });
        onClose();
        return;
      }

      // 🟢 Modo creación
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/report/create-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            title,
            category,
            description,
            location: "Unknown location",
          }),
        }
      );

      if (!response.ok) throw new Error("Error en la solicitud");

      alert("Reporte creado exitosamente.");
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el reporte.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md bg-blue-950/40 transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-blue-100 transform transition-all duration-500 ${
          fadeIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 transition"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          {report ? "Editar Denuncia" : "Mandar Reporte"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-medium mb-1 text-blue-900">Título</label>
            <input
              type="text"
              placeholder="Escribe un título descriptivo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-5">
            <label className="block font-medium mb-1 text-blue-900">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option>Seguridad</option>
              <option>Infraestructura</option>
              <option>Servicios</option>
              <option>Comportamiento</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block font-medium mb-1 text-blue-900">Descripción</label>
            <textarea
              placeholder="Describe lo sucedido con detalle..."
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex justify-between gap-3 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              {report ? "Actualizar" : "Enviar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-blue-300 text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
