import React, { useState } from 'react';
import { auth, db } from '../FireBase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const MainContent = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Registro en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda el correo y nombre de usuario en Firestore usando el UID
      await setDoc(doc(db, "usuarios", user.uid), { 
        email: user.email, 
        username: username 
      });

      setMessage("Registro exitoso");
    } catch (error) {
      console.error("Error en el registro:", error.message);
      setMessage("Error en el registro. Intente nuevamente.");
    }
  };

  return (
    <div className="informacion">
      <h1>ÚNETE A NUESTRA COMUNIDAD</h1>
      <p>
        ¡Descubre recetas increíbles con los ingredientes que ya tienes! Introduce lo
        que tienes en casa y te mostraremos las mejores recetas para crear platos
        deliciosos en minutos. ¡Comienza a cocinar hoy mismo!
      </p>
      <input
        type="text"
        placeholder="    Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="    Confirma tu contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
            <button onClick={handleRegister}>REGISTRATE</button>
            {message && <p>{message}</p>}
      <div className="login">

      <p>¿Ya tienes cuenta?</p>
      <button onClick={switchToLogin}>Inicia sesión</button>
      </div>

    </div>
  );
};

export default MainContent;