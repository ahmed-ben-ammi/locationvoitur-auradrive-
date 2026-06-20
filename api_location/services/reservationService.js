const reservationRepo = require('../repositories/reservationRepository');
const notificationService = require('../services/notificationService');

async function getAllReservations() {
  console.log('🔍 [reservationService] getAllReservations() called');
  const reservations = await reservationRepo.findAll();
  console.log('✅ [reservationService] getAllReservations() returning', reservations.length, 'reservations');
  return reservations;
}

async function getReservationById(id) {
  const reservation = await reservationRepo.findById(id);

  if (!reservation) {
    const error = new Error("Réservation introuvable");
    error.status = 404;
    throw error;
  }

  return reservation;
}

async function getReservationsByUser(userId) {
  return await reservationRepo.findByUserId(userId);
}

async function deleteReservation(id, userId, userRole) {
  const reservation = await reservationRepo.findById(id);
  if (!reservation) {
    const error = new Error("Réservation introuvable");
    error.status = 404;
    throw error;
  }
  
  // Check if user is admin OR the owner of the reservation
  const isOwner = reservation.user_id === userId;
  const isAdmin = userRole === 'admin';
  
  if (!isOwner && !isAdmin) {
    const error = new Error("Vous n'êtes pas autorisé à supprimer cette réservation");
    error.status = 403;
    throw error;
  }
  
  // If user is not admin, check that status is annulée or terminée
  if (!isAdmin) {
    const validStatuses = ['annulée', 'terminée'];
    if (!validStatuses.includes(reservation.statut)) {
      const error = new Error("Vous ne pouvez pas supprimer une réservation avec ce statut");
      error.status = 403;
      throw error;
    }
  }
  
  return await reservationRepo.delete(id);
}

async function createReservation(data, creatorRole) {
  const {
    user_id,
    voiture_id,
    car_id,
    date_debut,
    start_date,
    date_fin,
    end_date,
    statut = creatorRole === 'admin' ? 'confirmée' : 'en_attente'
  } = data;

  const finalVoitureId = voiture_id || car_id;
  const finalDateDebut = date_debut || start_date;
  const finalDateFin = date_fin || end_date;

  if (
    user_id === undefined ||
    finalVoitureId === undefined ||
    !finalDateDebut ||
    !finalDateFin
  ) {
    const error = new Error("Tous les champs sont obligatoires");
    error.status = 400;
    throw error;
  }

  const validStatuses = [
    'en_attente',
    'confirmée',
    'annulée',
    'terminée'
  ];

  if (!validStatuses.includes(statut)) {
    const error = new Error("Statut invalide");
    error.status = 400;
    throw error;
  }

  const reservationId = await reservationRepo.create({
    user_id,
    voiture_id: finalVoitureId,
    date_debut: finalDateDebut,
    date_fin: finalDateFin,
    statut
  });

  if (creatorRole === 'admin') {
    // Send notification to the client when admin creates reservation
    await notificationService.createNotification({
      user_id: user_id,
      reservation_id: reservationId,
      type: 'reservationCreatedByAdmin',
      role: 'client',
      title: 'notifications.client.reservationCreatedByAdmin.title',
      message: 'notifications.client.reservationCreatedByAdmin.message'
    });
  } else {
    // Send notifications to all admins!
    const adminUsers = await notificationService.getAdminUsers();
    for (const admin of adminUsers) {
      await notificationService.createNotification({
        user_id: admin.id,
        reservation_id: reservationId,
        type: 'newReservation',
        role: 'admin',
        title: 'notifications.admin.newReservation.title',
        message: 'notifications.admin.newReservation.message'
      });
    }
  }

  return reservationId;
}




async function updateReservationStatus(id, statut) {
  console.log('🔍 [reservationService] updateReservationStatus() called with id:', id, ', statut:', statut);
  if (!statut) {
    const error = new Error("Le statut est obligatoire");
    error.status = 400;
    throw error;
  }

  const validStatuses = [
    'en_attente',
    'confirmée',
    'annulée',
    'terminée'
  ];

  if (!validStatuses.includes(statut)) {
    const error = new Error("Statut invalide");
    error.status = 400;
    throw error;
  }

  // First, check if the reservation exists!
  const reservationCheck = await reservationRepo.findById(id);
  if (!reservationCheck) {
    const error = new Error("Réservation introuvable");
    error.status = 404;
    throw error;
  }

  await reservationRepo.updateStatus(id, statut);

  // Get the FULL updated reservation (with voiture and user details)
  const updatedReservation = await reservationRepo.findById(id);
  console.log('✅ [reservationService] get updated reservation:', updatedReservation);

  if (!updatedReservation) {
    const error = new Error("Réservation introuvable après mise à jour");
    error.status = 404;
    throw error;
  }

  const reservationForWhatsapp = await reservationRepo.getReservationWithUser(id);

  let message = '';
  let whatsappUrl = '';
  let notificationType = '';
  let notificationTitleKey = '';
  let notificationMessageKey = '';

  if (statut === 'confirmée') {
    message = 'Votre réservation a été acceptée ✅';
    notificationType = 'reservationApproved';
    notificationTitleKey = 'notifications.client.reservationApproved.title';
    notificationMessageKey = 'notifications.client.reservationApproved.message';

    const cleanedPhone = reservationForWhatsapp?.phone?.startsWith('0') 
      ? reservationForWhatsapp.phone.substring(1) 
      : reservationForWhatsapp?.phone || '';
    whatsappUrl = `https://wa.me/212${cleanedPhone}?text=${encodeURIComponent(message)}`;
  }

  if (statut === 'annulée') {
    message = 'Votre réservation a été refusée ❌';
    notificationType = 'reservationRejected';
    notificationTitleKey = 'notifications.client.reservationRejected.title';
    notificationMessageKey = 'notifications.client.reservationRejected.message';

    const cleanedPhone = reservationForWhatsapp?.phone?.startsWith('0') 
      ? reservationForWhatsapp.phone.substring(1) 
      : reservationForWhatsapp?.phone || '';
    whatsappUrl = `https://wa.me/212${cleanedPhone}?text=${encodeURIComponent(message)}`;
  }

  if (statut === 'terminée') {
    notificationType = 'reservationCompleted';
    notificationTitleKey = 'notifications.client.reservationCompleted.title';
    notificationMessageKey = 'notifications.client.reservationCompleted.message';
  }

  if (notificationType && reservationForWhatsapp?.user_id) {
    await notificationService.createNotification({
      user_id: reservationForWhatsapp.user_id,
      reservation_id: reservationForWhatsapp.id,
      type: notificationType,
      role: 'client',
      title: notificationTitleKey,
      message: notificationMessageKey
    });
  }

  return {
    success: true,
    whatsappUrl,
    reservation: updatedReservation
  };
}





module.exports = {
  getAllReservations,
  getReservationById,
  getReservationsByUser,
  createReservation,
  updateReservationStatus,
  deleteReservation
};