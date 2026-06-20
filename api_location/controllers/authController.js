
// const authService = require("../services/authService");
// const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   try {
//     const user = await authService.registerUser(req.body);

//     const token = jwt.sign(
//       { id: user.id, CNE: user.CNE, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
//     );

//     res.status(201).json({
//       message: "Utilisateur enregistré avec succès.",
//       token
//     });
//   } catch (err) {
//     console.error("Erreur d'inscription:", err);
//     res.status(err.status || 500).json({ message: err.message || "Erreur serveur." });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const user = await authService.loginUser(req.body);

//     const token = jwt.sign(
//       { id: user.id, CNE: user.CNE, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
//     );

//     res.status(200).json({ 
//       message: "Connexion réussie.", 
//       token,
      
//     });
//   } catch (err) {
//     console.error("Erreur de connexion:", err);
//     res.status(err.status || 500).json({ message: err.message || "Erreur serveur." });
//   }
// };
const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const user = await authService.registerUser(req.body);

    const token = jwt.sign(
      {
        id: user.id,
        CNE: user.CNE,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      token,
      user,
    });
  } catch (err) {
    console.error("Erreur d'inscription:", err);

    res.status(err.status || 500).json({
      message: err.message || "Erreur serveur.",
    });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    console.log("ADMIN REGISTER BODY:", req.body);

    const user = await authService.registerAdmin(req.body);

    res.status(201).json({
      message: "Administrateur enregistré avec succès.",
      user,
    });
  } catch (err) {
    console.error("Erreur d'inscription admin:", err);

    res.status(err.status || 500).json({
      message: err.message || "Erreur serveur.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const user = await authService.loginUser(req.body);

    const token = jwt.sign(
      {
        id: user.id,
        CNE: user.CNE,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      user,
    });
  } catch (err) {
    console.error("Erreur de connexion:", err);

    res.status(err.status || 500).json({
      message: err.message || "Erreur serveur.",
    });
  }
  console.log(req.headers);
console.log(req.body);
};