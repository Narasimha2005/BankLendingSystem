import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { makePayment } from '../services/api';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await makePayment(formData.loan_id, {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      });
      setResult(response);
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
      });
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-green-600" />
            Make Payment
          </h2>
          <p className="text-sm text-gray-600 mt-1">Process EMI or lump sum payments for your loans</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="loan_id" className="block text-sm font-medium text-gray-700">
                Loan ID
              </label>
              <input
                type="text"
                id="loan_id"
                name="loan_id"
                value={formData.loan_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter loan ID"
                required
              />
            </div>

            <div>
              <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                Payment Type
              </label>
              <select
                id="payment_type"
                name="payment_type"
                value={formData.payment_type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="EMI">EMI Payment</option>
                <option value="LUMP_SUM">Lump Sum Payment</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.payment_type === 'EMI' 
                  ? 'Regular monthly installment payment'
                  : 'Additional payment towards principal amount'
                }
              </p>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Payment Amount (Rs.)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter payment amount"
                min="0.01"
                step="0.01"
                required
              />
              {formData.payment_type === 'EMI' && (
                <p className="mt-1 text-xs text-amber-600">
                  ⚠️ For EMI payments, amount must match the exact monthly EMI amount
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Processing Payment...' : 'Process Payment'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Payment Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">Payment Successful!</h3>
                  <div className="mt-2 text-sm text-green-700 space-y-1">
                    <p><strong>Payment ID:</strong> {result.payment_id}</p>
                    <p><strong>Loan ID:</strong> {result.loan_id}</p>
                    <p><strong>Remaining Amount:</strong> Rs.{result.remaining_amount}</p>
                    <p><strong>Payment Type:</strong> {result.payment_type}</p>
                    {result.emi_left !== undefined && (
                      <p><strong>EMIs Left:</strong> {result.emi_left}</p>
                    )}
                    <p className="text-green-600 font-medium">{result.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;