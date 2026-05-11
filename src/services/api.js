import axios from 'axios';
import { adminUsers, dashboardStats, fraudAlerts, initialTransactions, loanCards, notificationsSeed } from './mockData';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const wait = (payload, delay = 450) => new Promise((resolve) => setTimeout(() => resolve({ data: payload }), delay));

export const mockApi = {
  login: (credentials) =>
    wait({
      user: {
        id: 1,
        name: credentials.email.includes('admin') ? 'Neo Admin' : 'Neo Customer',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'customer',
      },
      token: 'mock-token-neobankx',
    }),
  register: (payload) =>
    wait({
      user: {
        id: Date.now(),
        name: payload.fullName,
        email: payload.email,
        role: 'customer',
      },
      token: 'mock-token-neobankx',
    }),
  dashboard: () =>
    wait({
      stats: dashboardStats,
      transactions: initialTransactions,
      notifications: notificationsSeed,
      loans: loanCards,
      fraudAlerts,
      adminUsers,
    }),
  transfer: (payload) =>
    wait({
      success: true,
      transaction: {
        id: Date.now(),
        name: payload.recipient,
        amount: Number(payload.amount),
        status: 'Completed',
        date: 'Just now',
        type: 'debit',
      },
    }, 900),
};
