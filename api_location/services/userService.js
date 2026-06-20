const userRepo = require("../repositories/userRepository");

function validateUserFields(data, isUpdate = false) {
  const { name, CNE, phone, password, role } = data;

  // Always require these fields
  if (!name || !CNE || !phone || !role) {
    throw new Error("Tous les champs sont obligatoires.");
  }

  // Only require password for new users
  if (!isUpdate && !password) {
    throw new Error("Le mot de passe est obligatoire.");
  }

  const validRoles = ['admin', 'client'];
  if (!validRoles.includes(role)) {
    throw new Error("Role invalide.");
  }
}

module.exports = {
  getAllUsers() {
    return userRepo.findAll();
  },

  async getUserById(id) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error("Utilisateur introuvable");
    return user;
  },

  async postUser(data) {
    validateUserFields(data, false);

    // Check unique phone and CNE
    const existingByPhone = await userRepo.findByPhone(data.phone);
    if (existingByPhone) {
      throw new Error("Ce numéro de téléphone est déjà utilisé.");
    }

    const existingByCNE = await userRepo.findByCNE(data.CNE);
    if (existingByCNE) {
      throw new Error("Ce CNE est déjà utilisé.");
    }

    return await userRepo.create(data);
  },

  async putUser(id, data) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error("Utilisateur non trouvé.");

    validateUserFields(data, true);

    // Check unique phone and CNE (excluding current user)
    const existingByPhone = await userRepo.findByPhone(data.phone);
    if (existingByPhone && existingByPhone.id !== parseInt(id)) {
      throw new Error("Ce numéro de téléphone est déjà utilisé.");
    }

    const existingByCNE = await userRepo.findByCNE(data.CNE);
    if (existingByCNE && existingByCNE.id !== parseInt(id)) {
      throw new Error("Ce CNE est déjà utilisé.");
    }

    return await userRepo.update(id, data);
  },

  async deleteUser(id) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error("Utilisateur non trouvé.");

    return await userRepo.remove(id);
  },

  // async patchUser(id, status) {
  //   const user = await userRepo.findById(id);
  //   if (!user) throw new Error("Utilisateur non trouvé.");

  //   if (!status) throw new Error("Le status est requis.");

  //   const validStatuses = ['active', 'desactive'];
  //   if (!validStatuses.includes(status)) {
  //     throw new Error("Statut invalide.");
  //   }

  //   return await userRepo.updateStatus(id, status);
  // },

  async patchUserRole(id, role) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error("Utilisateur non trouvé.");

    const validRoles = ['admin', 'client'];
    if (!role || !validRoles.includes(role)) {
      throw new Error("Role invalide ou manquant.");
    }

    return await userRepo.updateRole(id, role);
  }
};
