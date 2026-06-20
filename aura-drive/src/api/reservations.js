// import api from './axios';

// export async function getUserReservations() {
//   try {
//     const response = await api.get('/reservations/user/my');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching reservations:', error);
//     throw error;
//   }
// }

// export async function deleteReservation(reservationId) {
//   try {
//     const response = await api.delete(`/reservations/${reservationId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting reservation:', error);
//     throw error;
//   }
// }

// export async function getAllReservations() {
//   try {
//     console.log('🔍 [api/reservations] Calling GET /reservations');
//     const response = await api.get('/reservations');
//     console.log('✅ [api/reservations] Response:', response);
//     console.log('✅ [api/reservations] Response data:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('❌ [api/reservations] Error fetching all reservations:', error);
//     throw error;
//   }
// }

// export async function updateReservationStatus(reservationId, status) {
//   try {
//     const response = await api.put(`/reservations/${reservationId}/status`, { statut: status });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating reservation:', error);
//     throw error;
//   }
// }

// export async function deleteReservation(reservationId) {
//   try {
//     const response = await api.delete(`/reservations/${reservationId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting reservation:', error);
//     throw error;
//   }
// }





import api from './axios';

export async function getUserReservations() {
  try {
    const response = await api.get('/reservations/user/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
}

export async function deleteReservation(reservationId) {
  try {
    const response = await api.delete(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
}

export async function getAllReservations() {
  try {
    console.log('🔍 [api/reservations] Calling GET /reservations');
    const response = await api.get('/reservations');
    console.log('✅ [api/reservations] Response:', response);
    console.log('✅ [api/reservations] Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [api/reservations] Error fetching all reservations:', error);
    throw error;
  }
}

export async function updateReservationStatus(reservationId, status) {
  try {
    const response = await api.put(
      `/reservations/${reservationId}/status`,
      { statut: status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
}

export async function createReservation(data) {
  try {
    const response = await api.post('/reservations', data);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}