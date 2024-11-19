import React, { useState, useEffect } from 'react';
import { db, auth } from '../FireBase';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import '../Css/Home.css';


const recipesData =
  [
    {
      "id": 1,
      "name": "Ensalada de Aguacate",
      "ingredients": "aguacate, lechuga, tomate",
      "description": "Corta los ingredientes en trozos pequeños y mezcla con una vinagreta. Sirve frío.",
      "time": "15 minutos",
      "portions": "2 porciones",
      "advice": "Puedes agregar queso feta o nueces para un toque crujiente.",
      "image": "https://cf-store.widencdn.net/mccormick/d/f/d/dfdbd709-b117-4052-a330-2c77059b4b10.jpg?response-content-disposition=inline%3B%20filename%3D%22Ensalada_de_Aguacate_Recipes_800x800.jpg%22&response-content-type=image%2Fjpeg&Expires=1732049389&Signature=DYwMMyo80hUEJiHeROc4396OGD~5Yskbw~xWD5stAMnfotm9vXMSixksot934R7qnF2EQoXmwKBHXN9iIPEATwTOqLGtQJGP8FCpnF8ka87Pn-PDRcI9d9qctxi~FTJzmAPemXjbWfsMRPVyeZOZwQYKYn3V~oMXjOfr6ch9bGJbQ5DlVCMGl0GBGo7XDbdcdWAr32ff2WfRjCKygSnxP46p3xdR~oeTLvqmPSWyknHRQTENq9HTbhcyeRVx9hbZG55bRFihkqcNHf62RClBSFQiJiui1LgkfsDHAYFN8ID84MRi~~CBO5Yz0dWqJ1V1ivY-e2s5GhW3JGLfnM0jXA__&Key-Pair-Id=APKAJD5XONOBVWWOA65A"
    },
    {
      "id": 2,
      "name": "Sopa de Verduras",
      "ingredients": "zanahoria, apio, papa",
      "description": "Hierve las verduras hasta que estén tiernas. Sirve caliente con un poco de sal.",
      "time": "40 minutos",
      "portions": "4 porciones",
      "advice": "Puedes agregar fideos o arroz para hacerla más sustanciosa.",
      "image": "https://cdn.recetasderechupete.com/wp-content/uploads/2019/10/Sopa-de-verduras-en-juliana.jpg"
    },
    {
      "id": 3,
      "name": "Pasta al Pesto",
      "ingredients": "pasta, albahaca, ajo",
      "description": "Cocina la pasta y mezcla con una salsa de pesto hecha de albahaca, ajo y aceite de oliva.",
      "time": "20 minutos",
      "portions": "2 porciones",
      "advice": "Añade piñones tostados o queso parmesano rallado por encima.",
      "image": "https://www.lavanguardia.com/files/og_thumbnail/uploads/2020/05/29/5ed11fb61d750.jpeg"
    },
    {
      "id": 4,
      "name": "Pollo a la Parrilla",
      "ingredients": "pollo, limón, orégano",
      "description": "Marina el pollo con limón y especias, luego cocina en la parrilla hasta dorar.",
      "time": "30 minutos",
      "portions": "4 porciones",
      "advice": "Puedes acompañarlo con una ensalada fresca o papas asadas.",
      "image": "https://www.clarin.com/img/2022/03/21/LeCTEz82B_1256x620__2.jpg"
    },
    {
      "id": 5,
      "name": "Tacos de Pescado",
      "ingredients": "pescado, tortillas, col",
      "description": "Fríe el pescado, sirve en tortillas con col y salsa de limón.",
      "time": "25 minutos",
      "portions": "3 porciones",
      "advice": "Acompáñalos con salsa picante y rodajas de aguacate.",
      "image": "https://www.goya.com/media/4192/grilled-fish-tacos.jpg?quality=80"
    },
    {
      "id": 6,
      "name": "Quiche de Espinacas",
      "ingredients": "espinacas, huevos, queso",
      "description": "Mezcla las espinacas con los huevos y el queso, hornea hasta que cuaje.",
      "time": "45 minutos",
      "portions": "6 porciones",
      "advice": "Puedes sustituir las espinacas por acelgas o añadir jamón para variar.",
      "image": "https://comedera.com/wp-content/uploads/sites/9/2018/09/quiche-de-espinacas.jpg"
    },

    {
      "id": 7,
      "name": "Pizza Margarita",
      "ingredients": "masa de pizza, tomate, queso",
      "description": "Cubre la masa con salsa de tomate, queso y albahaca. Hornea hasta que esté dorada.",
      "time": "30 minutos",
      "portions": "2 porciones",
      "advice": "Puedes agregar aceitunas negras o champiñones para variar el sabor.",
      "image": "https://www.elespectador.com/resizer/v2/D2KL4RRCRJA7RJC5TNULFZEKR4.jpg?auth=a0183c8d1446b9e01eaae717179a0b2d52646e7be97600a983f12574a90d6a6b&width=920&height=613&smart=true&quality=60"
    },
    {
      "id": 8,
      "name": "Hamburguesa Clásica",
      "ingredients": "carne molida, pan de hamburguesa, lechuga",
      "description": "Cocina la carne a la parrilla, sirve en pan con lechuga y tomate.",
      "time": "20 minutos",
      "portions": "1 hamburguesa",
      "advice": "Puedes añadir queso cheddar o una salsa especial para un toque extra.",
      "image": "https://simonparrilla.com.co/monteria/wp-content/uploads/2022/06/SIMON-PARRILLA-COMIDAS-RAPIDAS-HAMBURGUESA-CLASICA.webp"
    }




  ];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [username, setUsername] = useState('');
  const [activeSection, setActiveSection] = useState('all'); // Estado para alternar secciones
  const [expandedRecipe, setExpandedRecipe] = useState(null); // Para expandir recetas

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'usuarios', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
            setSavedRecipes(userDoc.data().savedRecipes || []);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos de usuario: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    const userRef = doc(db, 'usuarios', auth.currentUser.uid);
    const updatedSavedRecipes = savedRecipes.includes(recipeId)
      ? savedRecipes.filter(id => id !== recipeId)
      : [...savedRecipes, recipeId];

    await updateDoc(userRef, { savedRecipes: updatedSavedRecipes });
    setSavedRecipes(updatedSavedRecipes);
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
              <p>
                <strong>Preparación:</strong>
                {expandedRecipe === recipe.id ? (
                  recipe.description
                ) : (
                  `${recipe.description.slice(0, 50)}...`
                )}
              </p>
              {expandedRecipe === recipe.id && (
                <>
                  <p><strong>Tiempo:</strong> {recipe.time}</p>
                  <p><strong>Porciones:</strong> {recipe.portions}</p>
                  <p><strong>Consejo:</strong> {recipe.advice}</p>
                </>
              )}
              <button onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}>
                {expandedRecipe === recipe.id ? 'Leer Menos' : 'Leer Más'}
              </button>
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
          className={activeSection === 'all' ? 'active' : ''}
          onClick={() => setActiveSection('all')}
        >
          Todas las Recetas
        </button>
        <button
          className={activeSection === 'saved' ? 'active' : ''}
          onClick={() => setActiveSection('saved')}
        >
          Recetas Guardadas
        </button>
      </div>
      {activeSection === 'all' ? renderAllRecipes() : renderSavedRecipes()}
    </div>
  );
};

export default Home;
