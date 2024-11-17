import React, { useState, useEffect } from 'react';
import { db, auth } from '../FireBase';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import '../Css/Home.css';


const recipesData = [
  { 
    id: 1, 
    name: 'Ensalada de Aguacate', 
    ingredients: 'aguacate, lechuga, tomate', 
    description: 'Corta los ingredientes en trozos pequeños y mezcla con una vinagreta. Sirve frío.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921821.png'
  },
  { 
    id: 2, 
    name: 'Sopa de Verduras', 
    ingredients: 'zanahoria, apio, papa', 
    description: 'Hierve las verduras hasta que estén tiernas. Sirve caliente con un poco de sal.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921826.png'
  },
  { 
    id: 3, 
    name: 'Pasta al Pesto', 
    ingredients: 'pasta, albahaca, ajo', 
    description: 'Cocina la pasta y mezcla con una salsa de pesto hecha de albahaca, ajo y aceite de oliva.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
  },
  { 
    id: 4, 
    name: 'Pollo a la Parrilla', 
    ingredients: 'pollo, limón, orégano', 
    description: 'Marina el pollo con limón y especias, luego cocina en la parrilla hasta dorar.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921825.png'
  },
  { 
    id: 5, 
    name: 'Tacos de Pescado', 
    ingredients: 'pescado, tortillas, col', 
    description: 'Fríe el pescado, sirve en tortillas con col y salsa de limón.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921817.png'
  },
  { 
    id: 6, 
    name: 'Quiche de Espinacas', 
    ingredients: 'espinacas, huevos, queso', 
    description: 'Mezcla las espinacas con los huevos y el queso, hornea hasta que cuaje.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921831.png'
  },
  { 
    id: 7, 
    name: 'Pizza Margarita', 
    ingredients: 'masa de pizza, tomate, queso', 
    description: 'Cubre la masa con salsa de tomate, queso y albahaca. Hornea hasta que esté dorada.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921832.png'
  },
  { 
    id: 8, 
    name: 'Hamburguesa Clásica', 
    ingredients: 'carne molida, pan de hamburguesa, lechuga', 
    description: 'Cocina la carne a la parrilla, sirve en pan con lechuga y tomate.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921815.png'
  },
  { 
    id: 9, 
    name: 'Brownies de Chocolate', 
    ingredients: 'chocolate, harina, huevos', 
    description: 'Mezcla los ingredientes y hornea hasta que estén tiernos por dentro y crujientes por fuera.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921820.png'
  },
  { 
    id: 10, 
    name: 'Enchiladas', 
    ingredients: 'tortillas, pollo, salsa roja', 
    description: 'Rellena las tortillas con pollo, cúbrelas con salsa roja y hornea.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921819.png'
  },
  { 
    id: 11, 
    name: 'Galletas de Avena', 
    ingredients: 'avena, azúcar moreno, mantequilla', 
    description: 'Mezcla los ingredientes y hornea hasta que las galletas estén doradas.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921827.png'
  },
  { 
    id: 12, 
    name: 'Sushi Roll', 
    ingredients: 'alga nori, arroz, salmón', 
    description: 'Enrolla el arroz y el salmón en alga nori, corta en porciones pequeñas.',
    image: 'https://cdn-icons-png.flaticon.com/512/2921/2921830.png'
  },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [username, setUsername] = useState("");
  const [activeSection, setActiveSection] = useState("all"); // Estado para alternar secciones

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'usuarios', user.uid);
          const userDoc = await getDoc(userDocRef); // Get the user document
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
            setSavedRecipes(userDoc.data().savedRecipes || []);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos de usuario: ", error);
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload(); // Opcional: Recarga la página para redirigir al usuario
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  

  const handleSaveRecipe = async (recipeId) => {
    const userRef = doc(db, 'usuarios', auth.currentUser.uid);
    const updatedSavedRecipes = savedRecipes.includes(recipeId)
      ? savedRecipes.filter(id => id !== recipeId)
      : [...savedRecipes, recipeId];
      
    await updateDoc(userRef, { savedRecipes: updatedSavedRecipes });
    setSavedRecipes(updatedSavedRecipes); // Update the state
  };

  const filteredRecipes = recipesData.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAllRecipes = () => (
    <>
      <h2>Todas las recetas</h2>
      <div className="recipes-list">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.name} className="recipe-image" />
              <h2>{recipe.name}</h2>
              <p><strong>Ingredientes:</strong> {recipe.ingredients}</p>
              <p><strong>Preparación:</strong> {recipe.description}</p>
              <button onClick={() => handleSaveRecipe(recipe.id)}>
                {savedRecipes.includes(recipe.id) ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
                Guardar
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron recetas.</p>
        )}
      </div>
    </>
  );

  const renderSavedRecipes = () => (
    <>
      <h2>Recetas Guardadas</h2>
      <div className="recipes-list">
        {savedRecipes.length > 0 ? (
          savedRecipes.map((recipeId) => {
            const recipe = recipesData.find(r => r.id === recipeId);
            return (
              recipe && (
                <div key={recipe.id} className="recipe-card">
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                  <h2>{recipe.name}</h2>
                  <p><strong>Ingredientes:</strong> {recipe.ingredients}</p>
                  <p><strong>Preparación:</strong> {recipe.description}</p>
                </div>
              )
            );
          })
        ) : (
          <p>No tienes recetas guardadas.</p>
        )}
      </div>
    </>
  );


  return (
<div className="home-container">
      <div className="header">
      <h1>Bienvenido, {username}</h1>
        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      <input
        type="text"
        placeholder="Buscar receta"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="button-group">
        <button
          className={activeSection === "all" ? "active" : ""}
          onClick={() => setActiveSection("all")}
        >
          Todas las Recetas
        </button>
        <button
          className={activeSection === "saved" ? "active" : ""}
          onClick={() => setActiveSection("saved")}
        >
          Recetas Guardadas
        </button>
      </div>
      {activeSection === "all" ? renderAllRecipes() : renderSavedRecipes()}
    </div>
  );
};

export default Home;
