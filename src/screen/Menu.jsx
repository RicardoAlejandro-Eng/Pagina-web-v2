import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FormReport } from "../components/FormReport";
import { useAuth } from "../context/AuthContext";

export const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => logout();
  const showModalReport = () => setIsOpen(true);
  const hideModalReport = () => setIsOpen(false);

  return (
    <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 min-h-screen flex flex-col text-white font-[Poppins]">
      {/* 🔹 Navbar */}
      <nav className="bg-blue-900/60 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <a href="#" className="flex items-center group">
            <motion.img
              src="/img/mi_logo.png"
              alt="logo"
              className="h-10 object-contain group-hover:scale-110 transition-transform"
              whileHover={{ rotate: 10, scale: 1.05 }}
            />
            <span className="ml-3 text-white font-bold text-xl tracking-tight group-hover:text-blue-200 transition">
              Red de Apoyo
            </span>
          </a>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            🔒 Cerrar sesión
          </motion.button>
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 py-10">
        <motion.div
          className="bg-white text-blue-800 rounded-2xl shadow-2xl p-8 text-center max-w-lg w-full border border-blue-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="/img/mi_logo.png"
            alt="central"
            className="mx-auto mb-6 w-44 h-auto drop-shadow-lg"
          />
          <h4 className="font-bold text-2xl mb-3">
            Tu seguridad y bienestar son prioridad
          </h4>
          <p className="mb-6 text-gray-700 leading-relaxed">
            Reporta, recibe apoyo y contribuye a una comunidad más segura.
            Este sistema está diseñado para protegerte y acompañarte.
          </p>

          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            {/* 🟢 Botón para crear denuncia */}
            <motion.button
              onClick={showModalReport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              📢 Hacer Denuncia
            </motion.button>

            <motion.button
              onClick={() => navigate("/reports")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              📋 Ver Mis Denuncias
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 🔹 Footer */}
      <footer className="bg-blue-950 text-center py-6 text-blue-100 mt-auto shadow-inner">
        <p className="mb-2">
          ⚠️ En caso de sentirte en peligro, comunícate de inmediato con las autoridades.
        </p>
        <p className="font-bold text-white">
          Emergencias: 911 | Denuncia Anónima: 089
        </p>
      </footer>

      {/* 🔹 Modal para crear denuncia */}
      {isOpen && <FormReport isOpen={isOpen} onClose={hideModalReport} />}
    </div>
  );
};
