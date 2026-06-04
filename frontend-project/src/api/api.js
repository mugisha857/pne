import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// AUTH
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// PRODUCTS
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// SALES
export const getSales = () => API.get('/sales');
export const getDailySalesReport = (date) => API.get(`/sales/report/daily?date=${date}`);
export const createSale = (data) => API.post('/sales', data);
export const updateSale = (id, data) => API.put(`/sales/${id}`, data);
export const deleteSale = (id) => API.delete(`/sales/${id}`);

// STOCK STATUS
export const getStockStatus = () => API.get('/stockstatus');
export const createStock = (data) => API.post('/stockstatus', data);
export const updateStock = (id, data) => API.put(`/stockstatus/${id}`, data);
export const deleteStock = (id) => API.delete(`/stockstatus/${id}`);
