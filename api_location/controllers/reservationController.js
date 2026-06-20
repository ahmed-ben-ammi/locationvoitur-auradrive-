const reservationService = require('../services/reservationService');

module.exports = {
  async getAll(req, res, next) {
    try {
      console.log('🔍 [reservationController] getAll() called');
      const reservations = await reservationService.getAllReservations();
      console.log('✅ [reservationController] getAll() sending response with', reservations.length, 'reservations');
      console.log('📤 Response:', reservations);
      res.json(reservations);
    } catch (err) {
      console.error('❌ [reservationController] getAll() error:', err);
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const reservation = await reservationService.getReservationById(req.params.id);
      res.json(reservation);
    } catch (err) {
      next(err);
    }
  },

  async getByUser(req, res, next) {
    try {
      const reservations = await reservationService.getReservationsByUser(req.user.id);
      res.json(reservations);
    } catch (err) {
      next(err);
    }
  },

  // async create(req, res, next) {
  //   try {
  //     const id = await reservationService.createReservation(req.body);
  //     res.status(201).json({ message: "Réservation créée", id });
  //   } catch (err) {
  //     next(err);
  //   }
  // },
  async create(req, res, next) {
  try {
    console.log('Reservation request body:', req.body);
    console.log('User from token:', req.user);

    const data = {
      ...req.body,
      user_id: req.user.role === 'admin' && req.body.user_id ? req.body.user_id : req.user.id
    };

    console.log('Data to create reservation:', data);

    const id = await reservationService.createReservation(data, req.user.role);

    res.status(201).json({
      message: "Réservation créée",
      id
    });

  } catch (err) {
    console.error('Error creating reservation:', err);
    next(err);
  }
},

  // async updateStatus(req, res, next) {
  //   try {
  //     await reservationService.updateReservationStatus(req.params.id, req.body.statut);
  //     res.json({ message: "Statut mis à jour" });
  //   } catch (err) {
  //     next(err);
  //   }
  // },


async updateStatus(req, res, next) {
  try {
    console.log('🔍 [reservationController] updateStatus() called with id:', req.params.id, ', statut:', req.body.statut);
    const result = await reservationService.updateReservationStatus(
      req.params.id,
      req.body.statut
    );
    console.log('✅ [reservationController] updateStatus() result:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ [reservationController] updateStatus() error:', err);
    next(err);
  }
},




  async delete(req, res, next) {
    try {
      await reservationService.deleteReservation(req.params.id, req.user.id, req.user.role);
      res.json({ message: "Réservation supprimée" });
    } catch (err) {
      next(err);
    }
  }
};
