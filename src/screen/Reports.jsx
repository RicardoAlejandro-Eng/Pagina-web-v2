import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FormReport } from "../components/FormReport";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export const Reports = () => {
  const { token, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [splash, setSplash] = useState(true);
  const [reportSelected, setReportSelected] = useState(null);

  const statusMap = {
    Pendiente: "pending",
    Aprobada: "aproved",
    Rechazada: "rejected",
  };

  const loadReports = async (status = "Todas") => {
    try {
      setLoading(true);
      if (!user || !token) {
        toast.error("No cuenta con las credenciales necesarias");
        return;
      }
      const body = {};
      if (user.role_type !== "admin") body.user_id = user.id;
      if (status !== "Todas") body.status = statusMap[status];

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/report/get-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Error al obtener denuncias");
      const data = await response.json();
      setReports(data);
    } catch {
      toast.error("Hubo un error al cargar las denuncias");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setIsOpen(true);
    setReportSelected(report);
  };

  const editReport = async ({ id, user_id, title, category, description, location }) => {
    try {
      if (!user_id || !title || !category || !description || !location) throw new Error("Bad request");
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/report/update-report/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, title, category, description, location }),
      });
      if (!response.ok) throw new Error();
      toast.success("Denuncia actualizada correctamente");
      loadReports(filter);
    } catch {
      toast.error("No se pudo editar la denuncia");
    }
  };

  const deleteReport = async (id) => {
    if (!confirm("¿Eliminar esta denuncia?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/report/delete-report/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      toast.success("Denuncia eliminada correctamente");
      loadReports(filter);
    } catch {
      toast.error("No se pudo eliminar la denuncia");
    }
  };

  const translateStatus = (status) => {
    if (!status) return "Sin status";
    if (status === "pending") return "Pendiente";
    if (status === "aproved") return "Aprobada";
    if (status === "rejected") return "Rechazada";
    return "Sin status";
  };

  const showModalReport = () => setIsOpen(true);
  const hiddeModalReport = () => setIsOpen(false);

  const approveReport = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/report/aprove-report/${id}`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error();
      toast.success("Denuncia aprobada correctamente");
      loadReports(filter);
    } catch {
      toast.error("No se pudo aprobar la denuncia");
    }
  };

  const rejectReport = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/report/reject-report/${id}`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error();
      toast.success("Denuncia rechazada correctamente");
      loadReports(filter);
    } catch {
      toast.error("No se pudo rechazar la denuncia");
    }
  };

  useEffect(() => {
    loadReports(filter);
    const timer = setTimeout(() => setSplash(false), 1500);
    return () => clearTimeout(timer);
  }, [filter]);

  // Splash Screen
  if (splash) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0F4C75] to-[#3282B8] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.img
          src="/img/mi_logo.png"
          alt="logo"
          className="h-40 mb-4 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.p
          className="text-lg font-semibold tracking-wide animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Conectando con el sistema...
        </motion.p>
      </motion.div>
    );
  }

  // Navbar
  const Navbar = () => (
    <nav className="bg-[#0F4C75] text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <button
          onClick={() => (window.location.href = "/menu.html")}
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          <img src="/img/mi_logo.png" alt="logo" className="h-9 object-contain" />
          <span className="font-semibold text-lg">Mis Denuncias</span>
        </button>
        {user?.role_type === "user" && (
          <button
            onClick={showModalReport}
            className="bg-[#BBE1FA] text-[#0F4C75] px-4 py-2 rounded-md font-semibold hover:bg-[#A0D6FA] transition-all"
          >
            Nueva denuncia
          </button>
        )}
      </div>
    </nav>
  );

  return (
    <div className="bg-gradient-to-b from-[#F9FAFB] to-[#E8F1F5] min-h-screen font-[Poppins] flex flex-col text-[#1B262C]">
      <Toaster position="top-right" />
      <Navbar />

      <div className="container mx-auto max-w-4xl py-8 flex-grow">
        {/* Filtros */}
        <motion.div
          className="bg-white p-4 rounded-2xl shadow-md flex flex-wrap gap-2 justify-center border border-[#BBE1FA]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {["Pendiente", "Aprobada", "Rechazada", "Todas"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? "bg-[#3282B8] text-white shadow-md"
                  : "bg-[#E8F1F5] text-[#0F4C75] hover:bg-[#BBE1FA]"
              }`}
            >
              {status}
            </button>
          ))}
        </motion.div>

        {/* Lista */}
        <div className="mt-6">
          <AnimatePresence>
            {loading ? (
              <motion.p
                key="loading"
                className="text-center text-[#3282B8]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Cargando denuncias...
              </motion.p>
            ) : reports.length === 0 ? (
              <motion.div
                key="empty"
                className="bg-white text-center text-gray-600 py-6 rounded-2xl shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No se encontraron denuncias para este filtro.
              </motion.div>
            ) : (
              reports.map((report) => (
                <motion.div
                  key={report.id}
                  className="bg-white border border-[#E8F1F5] rounded-2xl shadow-md p-5 mb-4 hover:shadow-lg transition-transform hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h5 className="text-[#0F4C75] font-semibold text-lg">{report.title || "Sin título"}</h5>
                  <p><strong>Categoría:</strong> {report.category || "N/A"}</p>
                  <p><strong>Descripción:</strong> {report.description || "Sin descripción"}</p>
                  <p><strong>Ubicación:</strong> {report.location || "No especificada"}</p>

                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      report.status === "pending"
                        ? "bg-yellow-400 text-black"
                        : report.status === "aproved"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {translateStatus(report.status)}
                  </span>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {user?.role_type === "admin" && (
                      <>
                        <button
                          onClick={() => approveReport(report.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                          disabled={report.status === "aproved"}
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => rejectReport(report.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          disabled={report.status === "rejected"}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {user?.role_type === "user" && (
                      <>
                        <button
                          onClick={() => handleEditReport(report)}
                          className="bg-[#FFD166] text-black px-3 py-1 rounded hover:bg-[#FFCA3A] transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="bg-[#EF476F] text-white px-3 py-1 rounded hover:bg-[#E63946] transition"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-[#0F4C75] text-white text-center py-6 mt-auto w-full shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="italic">Gracias por contribuir a mejorar tu comunidad 💙</p>
      </motion.footer>

      {isOpen && (
        <FormReport
          isOpen={isOpen}
          onClose={hiddeModalReport}
          report={reportSelected}
          updateReport={editReport}
        />
      )}
    </div>
  );
};
