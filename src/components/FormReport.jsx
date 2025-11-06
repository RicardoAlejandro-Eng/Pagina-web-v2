import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const FormReport = ({ isOpen, onClose, report = null, updateReport = null }) => {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("📍 Detectando ubicación...");
  const [error, setError] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => setFadeIn(isOpen), [isOpen]);

  useEffect(() => {
    if (report) {
      setTitle(report.title || "");
      setCategory(report.category || "Seguridad");
      setDescription(report.description || "");
      setLocation(report.location || "Sin ubicación");
    } else {
      setTitle("");
      setCategory("Seguridad");
      setDescription("");
      obtenerUbicacionAutomatica();
    }
  }, [report]);

  const obtenerUbicacionAutomatica = async () => {
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const locRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const locData = await locRes.json();

      if (locData?.latitude && locData?.longitude) {
        setLocation(
          `${locData.city || "Ciudad desconocida"}, ${locData.region || ""}, ${locData.country_name || ""} (Lat: ${locData.latitude.toFixed(3)}, Lng: ${locData.longitude.toFixed(3)})`
        );
      } else {
        setLocation("Ubicación no disponible");
      }
    } catch (err) {
      console.error("Error obteniendo ubicación:", err);
      setLocation("Ubicación desconocida");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No tienes permisos para crear un reporte.");
      return;
    }

    try {
      if (updateReport && report) {
        updateReport({
          id: report.id,
          user_id: user.id,
          title,
          category,
          description,
          location,
        });
        onClose();
        return;
      }

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
            location,
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

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md bg-black/60 transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-blue-200 transform transition-all duration-500 ${
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
            <label className="block font-semibold mb-1 text-gray-800">Título</label>
            <input
              type="text"
              placeholder="Escribe un título descriptivo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-1 text-gray-800">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900"
            >
              <option>Seguridad</option>
              <option>Infraestructura</option>
              <option>Servicios</option>
              <option>Comportamiento</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-1 text-gray-800">Descripción</label>
            <textarea
              placeholder="Describe lo sucedido con detalle..."
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none bg-white text-gray-900 placeholder-gray-400"
            ></textarea>
          </div>

          <div className="mb-4 text-sm text-gray-800 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <strong>Ubicación detectada:</strong> {location}
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

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
