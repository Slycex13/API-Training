const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.json());
app.use(cors());

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: "sql.freedb.tech",
  user: "freedb_slycex",
  password: "Fnt@EC9V7S7PBvZ",
  database: "freedb_slyapp",
  port: 3306,
});

// Se connecter à la base de données
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected at database !");
});

//Login
app.post("/login", async (req, res) => {
  const credentials = req.body;
  try {
    const query = "SELECT * FROM accounts WHERE login = ?";
    const [results] = await connection
      .promise()
      .query(query, [credentials.login]);

    // Vérifier si l'utilisateur existe
    if (results.length === 0) {
      console.log("Utilisateur introuvable");
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    // Comparer le mot de passe
    const user = results[0];
    const match = await bcrypt.compare(credentials.password, user.password);
    if (!match) {
      console.log("Mot de passe incorrect");
      return res.status(404).json({
        success: false,
        message: "Mot de passe incorrect",
      });
    }

    // Connexion réussie
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      redirectTo: "http://127.0.0.1:5500/public/posts.html", // URL de redirection
    });
  } catch (error) {
    console.error("Erreur lors de l'authentification : ", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'authentification",
    });
  }
});

//Register
app.post("/register", async (req, res) => {
  const credentials = req.body;

  try {
    const hashedPassword = await bcrypt.hash(credentials.password, saltRounds);
    const query =
      "INSERT INTO accounts (login, password, email) VALUES (?,?,?)";
    const [results] = await connection
      .promise()
      .query(query, [credentials.login, hashedPassword, credentials.email]);
    if (results) {
      res.status(200).json({
        success: true,
        message: "Inscription réussie",
        redirectTo: "http://127.0.0.1:5500/public/index.html", // URL de redirection
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
    });
  }
});

// Route pour récupérer tous les posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des posts" });
  }
});

// Route pour récupérer un post
app.get("/posts/:id", async (req, res) => {
  const postId = req.params.id; // Récupérer l'ID du post depuis l'URL

  try {
    const query = "SELECT * FROM posts WHERE id = ?";
    const [results] = await connection.promise().query(query, [postId]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post non trouvé" });
    }

    res.json({ success: true, post: results[0] });
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du post",
    });
  }
});

// Route pour créer un post
app.post("/posts", async (req, res) => {
  const title = req.body.post;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Le titre est requis" });
  }

  try {
    const query = "INSERT INTO posts (post) VALUES (?)";
    const [result] = await connection.promise().query(query, [title]);
    const postId = result.insertId;
    res.json({
      success: true,
      message: "Post créé avec succès",
      post: { id: postId, post: title },
    });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du post",
    });
  }
});

// Route pour supprimer un post
app.delete("/posts/:id", async (req, res) => {
  const postId = req.params.id; // Récupérer l'ID du post depuis l'URL

  try {
    const query = "DELETE FROM posts WHERE id = ?";
    await connection.promise().query(query, [postId]);
    res.json({ success: true, message: "Post supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du post",
    });
  }
});

// Route pour mettre à jour un post
app.put("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const newTitle = req.body.title; // Récupérer le titre depuis le corps de la requête

  if (!newTitle) {
    return res
      .status(400)
      .json({ success: false, message: "Le titre est requis" });
  }

  try {
    const query = "UPDATE posts SET post = ? WHERE id = ?";
    await connection.promise().query(query, [newTitle, postId]);
    res.json({ success: true, message: "Post mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du post",
    });
  }
});

// Fonction pour récupérer tous les posts
async function getPosts() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM posts", function (err, results) {
      if (err) {
        reject(err); // En cas d'erreur, on rejette la Promise
      } else {
        resolve(results); // Si tout va bien, on résout la Promise avec les résultats
      }
    });
  });
}

// Met le serveur en écoute sur le port 3333
app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
