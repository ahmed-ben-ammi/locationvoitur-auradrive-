
// const bcrypt = require("bcrypt");
// const authRepo = require("../repositories/authRepository");

// module.exports = {
//   async registerUser(data) {
//     const { name, CNE, password, phone, email, role = 'client' } = data;

//     if (!name || !CNE || !password || !phone || !email) {
//       const error = new Error("Tous les champs sont obligatoires");
//       error.status = 400;
//       throw error;
//     }

//     const existingUser = await authRepo.findByCNE(CNE);
//     if (existingUser.length > 0) {
//       const error = new Error("Utilisateur déjà existant");
//       error.status = 409;
//       throw error;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const id = await authRepo.createUser({ name, CNE, hashedPassword, phone, email, role });

//     return { id, name, CNE, phone, email, status: 'active', role };
//   },

//   async loginUser(data) {
//     const { CNE, password } = data;

//     if (!CNE || !password) {
//       const error = new Error("Champs manquants");
//       error.status = 400;
//       throw error;
//     }

//     const user = await authRepo.findByCNE(CNE);
//     if (!user || user.length === 0) {
//       const error = new Error("Utilisateur introuvable");
//       error.status = 404;
//       throw error;
//     }

//     const match = await bcrypt.compare(password, user[0].password);
//     if (!match) {
//       const error = new Error("Mot de passe incorrect");
//       error.status = 401;
//       throw error;
//     }

//     const { id, name, phone, email, status, role } = user[0];
//     return { id, name, CNE, phone, email, status, role };
//   }
// };
const bcrypt = require("bcrypt");
const authRepo = require("../repositories/authRepository");

// Validate phone number: only digits (0-9)
const isValidPhone = (phone) => /^[0-9]+$/.test(phone);

module.exports = {
  async registerUser(data) {
    if (!data) {
      const error = new Error("Données manquantes");
      error.status = 400;
      throw error;
    }

    const { name, CNE, password, phone, role = "client" } = data;

    if (!name || !CNE || !password || !phone) {
      const error = new Error("Tous les champs sont obligatoires");
      error.status = 400;
      throw error;
    }

    if (!isValidPhone(phone)) {
      const error = new Error("Numéro de téléphone invalide (seulement des chiffres)");
      error.status = 400;
      throw error;
    }

    const existingUser = await authRepo.findByCNE(CNE);

    if (existingUser.length > 0) {
      const error = new Error("Utilisateur déjà existant");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await authRepo.createUser({
      name,
      CNE,
      hashedPassword,
      phone,
      role,
    });

    return {
      id,
      name,
      CNE,
      phone,
      role,
    };
  },

  async registerAdmin(data) {
    if (!data) {
      const error = new Error("Données manquantes");
      error.status = 400;
      throw error;
    }

    const { name, CNE, password, phone, secretKey } = data;

    // Verify admin secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      const error = new Error("Clé secrète invalide");
      error.status = 401;
      throw error;
    }

    if (!name || !CNE || !password || !phone) {
      const error = new Error("Tous les champs sont obligatoires");
      error.status = 400;
      throw error;
    }

    if (!isValidPhone(phone)) {
      const error = new Error("Numéro de téléphone invalide (seulement des chiffres)");
      error.status = 400;
      throw error;
    }

    const existingUser = await authRepo.findByCNE(CNE);

    if (existingUser.length > 0) {
      const error = new Error("Utilisateur déjà existant");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await authRepo.createUser({
      name,
      CNE,
      hashedPassword,
      phone,
      role: "admin",
    });

    return {
      id,
      name,
      CNE,
      phone,
      role: "admin",
    };
  },

  async loginUser(data) {
    if (!data) {
      const error = new Error("Données manquantes");
      error.status = 400;
      throw error;
    }

    const { CNE, password } = data;

    if (!CNE || !password) {
      const error = new Error("CNE et mot de passe sont obligatoires");
      error.status = 400;
      throw error;
    }

    const user = await authRepo.findByCNE(CNE);

    if (!user || user.length === 0) {
      const error = new Error("Utilisateur introuvable");
      error.status = 404;
      throw error;
    }

    const match = await bcrypt.compare(password, user[0].password);

    if (!match) {
      const error = new Error("Mot de passe incorrect");
      error.status = 401;
      throw error;
    }

    const { id, name, phone, role } = user[0];

    return {
      id,
      name,
      CNE,
      phone,
      role,
    };
  },
};