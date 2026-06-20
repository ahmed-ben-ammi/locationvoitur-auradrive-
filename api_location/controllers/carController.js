const carService = require('../services/carService');

const getAllcars = async (req, res) => {
    try {
        const cars = await carService.getAllcars();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await carService.getCarById(id);
        res.json(car);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createCar = async (req, res) => {
    try {
        const carData = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        const newCarId = await carService.createCar(carData, imageFilename);
        res.status(201).json({ id: newCarId, message: 'Voiture ajoutée avec succès !' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// const updateCar = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const carData = req.body;
//         const imagePath = req.file ? req.file.path : null;

//         const affectedRows = await carService.updateCar(id, carData, imagePath);
        
//         if (affectedRows === 0) {
//             return res.status(404).json({ message: "Véhicule introuvable" });
//         }

//         res.status(200).json({ message: "Voiture mise à jour avec succès" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const carData = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        const affectedRows = await carService.updateCar(id, carData, imageFilename);

        res.status(200).json({ message: "Voiture mise à jour avec succès" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        
        await carService.updateCarStatus(id, statut);
        
        res.status(200).json({ message: "Statut du véhicule mis à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        await carService.deleteCar(id);
        res.status(200).json({ message: "Voiture supprimée avec succès" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getAllcars,
    getCarById,
    createCar,
    updateCar,
    updateCarStatus,
    deleteCar
};