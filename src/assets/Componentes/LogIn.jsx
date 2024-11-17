import React, { useState } from 'react';
import { auth } from '../FireBase';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ onLoginSuccess, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Inicio de sesión exitoso");
      onLoginSuccess();
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setMessage("Error al iniciar sesión. Verifique sus credenciales.");
    }
  };

  return (
    <div className="informacion">
      <h1>Iniciar Sesión</h1>
      <input
        type="email"
        placeholder="    Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="    Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>INICIAR SESIÓN</button>
      {message && <p>{message}</p>}
      <button onClick={switchToRegister}>¿No tienes cuenta? Regístrate</button>
    </div>
  );
};

export default Login;
