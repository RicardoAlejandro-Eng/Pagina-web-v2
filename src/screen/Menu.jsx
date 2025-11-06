import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FormReport } from "../components/FormReport";
import { useAuth } from "../context/AuthContext";

export const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const showModalReport = () => setIsOpen(true);
  const hideModalReport = () => setIsOpen(false);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden font-[Poppins] bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      {/* 🔹 FONDO ANIMADO */}
      <motion.div
        className="absolute top-0 left-0 w-[120%] h-[60%] bg-gradient-to-r from-blue-700/50 to-white/20 rotate-[15deg] -translate-x-24 -translate-y-24 rounded-3xl"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[100%] h-[50%] bg-gradient-to-l from-blue-500/30 to-white/10 -rotate-[10deg] rounded-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      {/* 🔹 NAVBAR ORIGINAL */}
      <nav className="bg-blue-900/60 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <a href="#" className="flex items-center group">
            <motion.img
              src="/img/mi_logo.png"
              alt="logo"
              className="h-8 sm:h-10 object-contain group-hover:scale-110 transition-transform"
              whileHover={{ rotate: 10, scale: 1.05 }}
            />
            <span className="ml-2 sm:ml-3 text-white font-bold text-lg sm:text-xl tracking-tight group-hover:text-blue-200 transition">
              Red de Apoyo
            </span>
          </a>

          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 sm:px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg text-sm sm:text-base transition-all"
          >
            🔒 Cerrar sesión
          </motion.button>
        </div>
      </nav>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <main className="flex-1 relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-10 sm:py-20">
        {/* Izquierda: Bienvenida */}
        <motion.div
          className="z-10 md:w-[50%] text-center md:text-left mb-10 md:mb-0"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Bienvenido al Sistema de Denuncias
          </motion.h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
            Tu voz importa. Cada denuncia ayuda a construir una comunidad más segura y consciente.  
            Actuemos juntos por un futuro libre de violencia y corrupción.
          </p>
        </motion.div>

        {/* Derecha: Botones */}
        <div className="relative md:absolute md:top-1/2 md:right-16 flex flex-col gap-6 sm:gap-8 md:-translate-y-1/2 z-20 w-full md:w-auto items-center md:items-end">
          {/* 📢 Crear denuncia */}
          <motion.button
            onClick={showModalReport}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 30px rgba(59,130,246,0.7)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative py-3 px-6 sm:px-8 font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white overflow-hidden border border-blue-300 shadow-lg w-[80%] sm:w-[60%] md:w-auto text-sm sm:text-base"
          >
            <span className="relative z-10">📢 Crear Denuncia</span>
            <motion.span
              className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-0"
              whileHover={{ opacity: 0.2, x: [0, 200, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>

          {/* 📋 Ver mis denuncias */}
          <motion.button
            onClick={() => navigate("/reports")}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 30px rgba(34,197,94,0.7)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative py-3 px-6 sm:px-8 font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-green-400 text-white overflow-hidden border border-green-300 shadow-lg w-[80%] sm:w-[60%] md:w-auto text-sm sm:text-base"
          >
            <span className="relative z-10">📋 Ver Mis Denuncias</span>
            <motion.span
              className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-0"
              whileHover={{ opacity: 0.2, x: [0, 200, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>
        </div>
      </main>

      {/* 🔹 FOOTER ORIGINAL */}
      <footer className="bg-blue-950 text-center py-6 text-blue-100 mt-auto shadow-inner z-30 px-4 text-sm sm:text-base">
        <p className="mb-2">
          ⚠ En caso de sentirte en peligro, comunícate de inmediato con las autoridades.
        </p>
        <p className="font-bold text-white">
          Emergencias: 911 | Denuncia Anónima: 089
        </p>
      </footer>

      {/* 🔹 MODAL */}
      {isOpen && <FormReport isOpen={isOpen} onClose={hideModalReport} />}
    </div>
  );
};
