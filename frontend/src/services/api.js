import axios from 'axios'


const BASE_URL = 'http://localhost:3000';

export const loginShop = async ({ username, password }) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, { username, password });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Request failed' };
  }
};


export const getPawnTickets = async (status = '', accountId = '', page = 1, pageSize = 20) => {
  try {
    let url = `${BASE_URL}/pawnticket`;
    let params = {};
    if (status) {
      url = `${BASE_URL}/pawnticket/status/${status}`;
    } else if (accountId) {
      url = `${BASE_URL}/pawnticket/account/${accountId}`;
    }
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    const res = await axios.get(url, { params });
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getPawnTicketById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/pawnticket/account/${id}`);
    
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createPawnTicket = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/pawnticket/create`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const updatePawnTicket = async (id, data) => {
  try {
    const res = await axios.put(`${BASE_URL}/pawnticket/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const deletePawnTicket = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/pawnticket/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const updatePawnTicketStatus = async (id, status, settled_date = null) => {
  try {
    const res = await axios.patch(`${BASE_URL}/pawnticket/${id}/status`, { status, settled_date });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
export const getAccounts = async () => {
  try {
    ;
    const res = await axios.get(`${BASE_URL}/api/accounts`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getAccountById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/accounts/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createAccount = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/accounts`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const updateAccount = async (id, data) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/accounts/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const deleteAccount = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/accounts/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
