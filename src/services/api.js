const API_BASE_URL = 'https://bank-lending-system-server.vercel.app/api/v1';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const createLoan = async (loanData) => {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loanData),
  });
  return handleResponse(response);
};

export const makePayment = async (loanId, paymentData) => {
  const response = await fetch(`${API_BASE_URL}/loans/${loanId}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  return handleResponse(response);
};

export const getLoanLedger = async (loanId) => {
  const response = await fetch(`${API_BASE_URL}/loans/${loanId}/ledger`);
  return handleResponse(response);
};

export const getCustomerOverview = async (customerId) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}/overview`);
  return handleResponse(response);
};
