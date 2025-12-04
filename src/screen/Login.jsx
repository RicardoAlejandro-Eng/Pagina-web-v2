import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login, user: userContext } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Regex corregido
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;
  const isPasswordValid = passwordRegex.test(pass);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegistering && !isPasswordValid) {
      setError("⚠ La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    const url = isRegistering
      ? `${import.meta.env.VITE_SERVER_URL}/api/auth/create-user`
      : `${import.meta.env.VITE_SERVER_URL}/api/auth/login`;

    const body = isRegistering
      ? { name, email: user, password: pass, role_type: "user" }
      : { email: user, password: pass };

    try {
      const request = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!request.ok) throw new Error("Failed request");
      const res = await request.json();

      if (isRegistering) {
        setSuccess("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        setIsRegistering(false);
        setName("");
        setPass("");
        setUser("");
      } else {
        login({ ...res.user, token: res.jwt });
        if (res.user.role_id === 1 && res.user.role_type === "admin") {
          navigate("/reports", { replace: true });
        } else {
          navigate("/menu", { replace: true });
        }
      }
    } catch (err) {
      setError(
        isRegistering
          ? "⚠ No se pudo completar el registro."
          : "⚠ Usuario o contraseña incorrectos."
      );
    }
  };

  useEffect(() => {
    if (userContext) navigate("/menu", { replace: true });
  }, [userContext]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <motion.div
        className="flex-1 flex flex-col items-center justify-center 
                   bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-950 
                   text-white p-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.img
          src="/img/mi_logo.png"
          alt="logo"
          className="w-48 md:w-56 mb-8 z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.h2
          className="text-3xl md:text-4xl font-bold z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Bienvenido a RAVD
        </motion.h2>
        <motion.p
          className="text-blue-200 mt-3 z-10 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Gestiona tus denuncias de manera rápida y segura.
        </motion.p>
        <motion.div
          className="absolute -bottom-10 left-0 right-0 h-32 bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      </motion.div>

      <motion.div
        className="flex-1 flex items-center justify-center bg-white p-8"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-md">
          <h3 className="text-blue-200 font-bold text-2xl mb-6 text-center">
            {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={60}
              />
            )}

            <input
              type="email"
              placeholder="Correo electrónico"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="username"
              required
              maxLength={80}
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className={`w-full px-4 py-3 border ${
                  isRegistering
                    ? isPasswordValid
                      ? "border-green-400"
                      : "border-red-400"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoComplete="current-password"
                required
                maxLength={50}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-700 hover:text-black transition"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isRegistering && (
              <div className="text-sm text-gray-600 mt-1">
                <p>🔒 La contraseña debe incluir:</p>
                <ul className="list-disc ml-6">
                  <li>Una mayúscula (A-Z)</li>
                  <li>Una minúscula (a-z)</li>
                  <li>Un número (0-9)</li>
                  <li>Un carácter especial (!@#$%)</li>
                  <li>Mínimo 8 caracteres</li>
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-800 text-white font-semibold py-3 rounded-lg hover:bg-blue-900 transition"
            >
              {isRegistering ? "Registrarse" : "Entrar"}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-center text-red-500 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 text-center text-green-600 font-medium">
              {success}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 hover:underline font-medium"
            >
              {isRegistering
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "Crear una cuenta nueva"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
