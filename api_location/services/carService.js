const carRepo = require('../repositories/carRepository');
const fs = require('fs').promises;
const path = require('path');
const fsSync = require('fs');

// Helper function to safely get the correct file path and delete if exists
const deleteImageFile = async (imageValue) => {
    if (!imageValue) return;

    // Clean up the image value: remove any existing "uploads/" prefix
    let cleanFilename = imageValue;
    if (cleanFilename.startsWith('uploads/')) {
        cleanFilename = cleanFilename.replace('uploads/', '');
    }

    // Build absolute path using path module (works across OS)
    const absolutePath = path.join(__dirname, '../uploads', cleanFilename);

    // Check if file exists
    if (fsSync.existsSync(absolutePath)) {
        try {
            await fs.unlink(absolutePath);
        } catch (err) {
            console.error(`Error deleting file ${absolutePath}:`, err);
        }
    } else {
        console.warn(`File not found for deletion: ${absolutePath}`);
    }
};

const getAllcars = async () => {
    return await carRepo.findAll();
};

const getCarById = async (id) => {
    const car = await carRepo.findById(id);

    if (!car) {
        throw new Error("Véhicule introuvable");
    }

    return car;
};

const createCar = async (carData, imageFilename) => {

    if (
        !carData.marque ||
        !carData.modele ||
        !carData.annee ||
        !carData.numero_immatriculation ||
        !carData.prix_par_jour ||
        !carData.statut
    ) {
        throw new Error("Tous les champs sont obligatoires.");
    }

    const validStatuses = [
        "disponible",
        "reservée",
        "en_maintenance"
    ];

    if (!validStatuses.includes(carData.statut)) {
        throw new Error(
            "Le statut doit être 'disponible', 'reservée' ou 'en_maintenance'."
        );
    }

    if (Number(carData.prix_par_jour) <= 0) {
        throw new Error(
            "Le prix par jour doit être supérieur à 0."
        );
    }

    if (!imageFilename) {
        throw new Error(
            "Une image est obligatoire pour la création du véhicule."
        );
    }

    carData.image = imageFilename;

    const newCarId = await carRepo.create(carData);

    return newCarId;
};

const updateCar = async (id, carData, imageFilename) => {

    if (carData.statut) {
        const validStatuses = [
            "disponible",
            "reservée",
            "en_maintenance"
        ];

        if (!validStatuses.includes(carData.statut)) {
            throw new Error(
                "Le statut doit être 'disponible', 'reservée' ou 'en_maintenance'."
            );
        }
    }

    if (
        carData.prix_par_jour &&
        Number(carData.prix_par_jour) <= 0
    ) {
        throw new Error(
            "Le prix par jour doit être supérieur à 0."
        );
    }

    let oldImageFilename = null;

    if (imageFilename) {
        const oldCar = await carRepo.findById(id);

        if (!oldCar) {
            throw new Error("Véhicule introuvable");
        }

        oldImageFilename = oldCar.image;
        carData.image = imageFilename;
    }

    const affectedRows = await carRepo.update(id, carData);

    if (affectedRows === 0) {
        throw new Error("Véhicule introuvable");
    }

    if (oldImageFilename) {
        await deleteImageFile(oldImageFilename);
    }

    return affectedRows;
};

const updateCarStatus = async (id, newStatus) => {

    const validStatuses = [
        "disponible",
        "reservée",
        "en_maintenance"
    ];

    if (!newStatus || !validStatuses.includes(newStatus)) {
        throw new Error("Statut non valide");
    }

    const affectedRows = await carRepo.updateStatus(
        id,
        newStatus
    );

    if (affectedRows === 0) {
        throw new Error("Véhicule introuvable");
    }

    return affectedRows;
};

const deleteCar = async (id) => {

    const carToDelete = await carRepo.findById(id);

    if (!carToDelete) {
        throw new Error("Véhicule introuvable");
    }

    if (carToDelete.image) {
        await deleteImageFile(carToDelete.image);
    }

    return await carRepo.remove(id);
};

module.exports = {
    getAllcars,
    getCarById,
    createCar,
    updateCar,
    updateCarStatus,
    deleteCar
};