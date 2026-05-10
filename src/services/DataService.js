/**
 * MyStadium Data Service
 * 
 * A relational data layer for managing interactions between players, 
 * owners, and stadiums using linked tables.
 * 
 * Schema:
 *   - users: { id, email, password, fullName, role, ... }
 *   - stadiums: { id, ownerId (FK), name, location, price, capacity, hours, photo }
 *   - bookings: { id, stadiumId (FK), userId (FK), slot, status, date }
 *   - matches: { id, bookingId (FK), neededPlayers, currentPlayers (FK[]), ageGroup, phone, status }
 *   - ratings: { id, stadiumId (FK), userId (FK), lighting, pitch, cleanliness, comment, date }
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://mystadium.onrender.com/api';

class DataService {
  // --- Auth & Users ---
  async registerUser(userData) {
    const isFormData = userData instanceof FormData;
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? userData : JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }
    return await response.json();
  }

  async loginUser(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  }

  async updateProfile(userId, fullName, email) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fullName, email }),
    });
    if (!response.ok) throw new Error('Profile update failed');
    return await response.json();
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const response = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Password update failed');
    }
    return await response.json();
  }

  // --- Stadiums ---
  async getAllStadiums() {
    const response = await fetch(`${API_URL}/stadiums`);
    return await response.json();
  }

  async getStadiumByOwner(ownerId) {
    const response = await fetch(`${API_URL}/stadiums/owner/${ownerId}`);
    return await response.json();
  }

  async updateStadium(stadiumId, data) {
    const body = { ...data };
    if (stadiumId) body.id = stadiumId;
    
    const response = await fetch(`${API_URL}/stadiums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update stadium');
    }
    return await response.json();
  }

  // --- Bookings ---
  async createBooking(stadiumId, userId, slot, date) {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stadiumId, userId, slot, date }),
    });
    if (!response.ok) throw new Error('Booking failed');
    return await response.json();
  }


  async getStadiumBookings(stadiumId) {
    const response = await fetch(`${API_URL}/bookings/stadium/${stadiumId}`);
    return await response.json();
  }

  async getNotifications(userId) {
    const res = await fetch(`${API_URL}/notifications/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  }

  async createNotification(data) {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create notification');
    return res.json();
  }

  async markNotificationRead(notificationId) {
    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return res.json();
  }

  async getPlayerBookings(userId) {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`);
    return await response.json();
  }

  async updateBookingStatus(bookingId, status) {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Status update failed');
    return await response.json();
  }

  async getAllBookings() {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch all bookings');
    return await response.json();
  }

  // --- QR Validation & Payments ---
  async scanBooking(qrToken) {
    const response = await fetch(`${API_URL}/validation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Scanning failed');
    return data;
  }

  async confirmPayment(bookingId) {
    const response = await fetch(`${API_URL}/validation/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Payment confirmation failed');
    return data;
  }

  // --- Matches (Matchmaking) ---
  async createMatch(bookingId, needed, ageGroup, phone) {
    const response = await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, neededPlayers: needed, ageGroup, phone }),
    });
    if (!response.ok) throw new Error('Match creation failed');
    return await response.json();
  }

  async getOpenMatches() {
    const response = await fetch(`${API_URL}/matches/open`);
    return await response.json();
  }

  async joinMatch(matchId, userId) {
    const response = await fetch(`${API_URL}/matches/${matchId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  }

  // --- Ratings ---
  async addRating(stadiumId, userId, ratings) {
    await fetch(`${API_URL}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stadiumId, userId, ...ratings }),
    });
  }

  async getStadiumStats(stadiumId) {
    const response = await fetch(`${API_URL}/ratings/stadium/${stadiumId}`);
    const ratings = await response.json();

    if (!ratings || ratings.length === 0) return { lighting: 0, pitch: 0, cleanliness: 0, count: 0 };

    const totals = ratings.reduce((acc, r) => ({
      lighting: acc.lighting + r.lighting,
      pitch: acc.pitchQuality + r.pitchQuality,
      cleanliness: acc.cleanliness + r.cleanliness
    }), { lighting: 0, pitch: 0, cleanliness: 0 });

    const count = ratings.length;
    return {
      lighting: parseFloat((totals.lighting / count).toFixed(1)),
      pitch: parseFloat((totals.pitch / count).toFixed(1)),
      cleanliness: parseFloat((totals.cleanliness / count).toFixed(1)),
      count
    };
  }

  async updateLocation(userId, latitude, longitude) {
    const response = await fetch(`${API_URL}/auth/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, latitude, longitude }),
    });
    return await response.json();
  }

  // --- Password Reset ---
  async requestPasswordReset(email) {
    const response = await fetch(`${API_URL}/password/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to request reset');
    return data;
  }

  async verifyResetToken(token) {
    const response = await fetch(`${API_URL}/password/verify-token/${token}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Invalid or expired token');
    return data;
  }

  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_URL}/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reset password');
    return data;
  }
}

export default new DataService();
