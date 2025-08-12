import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const loginShop = async ({ username, password }) => {
  try {
    const res = await api.post('/auth/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
    }
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Login failed' };
  }
};

export const getPawnTickets = async (status = '') => {
  try {
    const params = {};
    if (status) {
      params.status = status;
    }
    const res = await api.get('/pawntickets', { params });
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getPawnTicketById = async (id) => {
  try {
    const res = await api.get(`/pawntickets/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getPawnTicketsByAccountId = async (accountId) => {
  try {
    const res = await api.get(`/accounts/${accountId}/pawntickets`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createPawnTicket = async (data) => {
  try {
    const res = await api.post('/pawntickets', data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to create pawn ticket' };
  }
};

export const updatePawnTicket = async (id, data) => {
  try {
    const res = await api.put(`/pawntickets/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to update pawn ticket' };
  }
};

export const deletePawnTicket = async (id) => {
  try {
    const res = await api.delete(`/pawntickets/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to delete pawn ticket' };
  }
};

export const updatePawnTicketStatus = async (id, status, settled_date = null) => {
  try {
    const res = await api.patch(`/pawntickets/${id}/status`, { status, settled_date });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to update status' };
  }
};

export const getAccounts = async () => {
  try {
    const res = await api.get('/accounts');
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getAccountById = async (id) => {
  try {
    const res = await api.get(`/accounts/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createAccount = async (data) => {
  try {
    const res = await api.post('/accounts', data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to create account' };
  }
};

export const updateAccount = async (id, data) => {
  try {
    const res = await api.patch(`/accounts/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to update account' };
  }
};

export const deleteAccount = async (id) => {
  try {
    const res = await api.delete(`/accounts/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || 'Failed to delete account' };
  }
};