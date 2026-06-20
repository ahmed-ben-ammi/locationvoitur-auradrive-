const userService = require("../services/userService");


module.exports = {
  //  Obtenir tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers(); 
      res.status(200).json(users);
    } catch (err) {
      console.error("Erreur getAllUsers:", err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  },

  //  Obtenir un utilisateur par ID
  async getUserById(req, res) {
    try {
      const id = req.params.id;
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      console.error("Erreur getUserById:", err);
      res.status(404).json({ message: err.message });
    }
  },

  //  Créer un utilisateur
  async postUser(req, res) {
    try {
      const data = req.body;
      const newUser = await userService.postUser(data);
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Erreur postUser:", err);
      res.status(400).json({ message: err.message });
    }
  },

  //  Modifier un utilisateur
  async putUser(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updated = await userService.putUser(id, data);
      res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
    } catch (err) {
      console.error("Erreur putUser:", err);
      res.status(404).json({ message: err.message });
    }
  },

  //  Supprimer un utilisateur
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      await userService.deleteUser(id);
      res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
      console.error("Erreur deleteUser:", err);
      res.status(404).json({ message: err.message });
    }
  },
  // modifire status
  async patchUser(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body;

    await userService.patchUser(id, status);
    res.status(200).json({ message: "Statut mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur patchUser:", err);
    res.status(400).json({ message: err.message });
  }
},
async patchUserRole(req, res) {
  const id = req.params.id;
  const { role } = req.body;

  try {
    await userService.patchUserRole(id, role);
    res.json({ message: 'Role mis à jour avec succès' });
  } catch (error) {
    if (error.message === 'Utilisateur non trouvé.') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Role invalide ou manquant.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}


  

};
