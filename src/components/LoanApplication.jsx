import React, { useState } from 'react';
import { Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { createLoan } from '../services/api';

const LoanApplication = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    
    // Auto-calculate preview if all fields are filled
    const updatedData = { ...formData, [name]: value };
    if (updatedData.loan_amount && updatedData.loan_period_years && updatedData.interest_rate_yearly) {
      calculatePreview(updatedData);
    } else {
      setPreview(null);
    }
  };

  const calculatePreview = (data) => {
    const principal = parseFloat(data.loan_amount);
    const years = parseInt(data.loan_period_years);
    const rate = parseFloat(data.interest_rate_yearly);

    if (principal > 0 && years > 0 && rate >= 0) {
      const totalInterest = principal * years * (rate / 100);
      const totalAmount = principal + totalInterest;
      const monthlyEmi = totalAmount / (years * 12);

      setPreview({
        totalInterest: totalInterest.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        monthlyEmi: monthlyEmi.toFixed(2)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await createLoan(formData);
      setResult(response);
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-blue-600" />
            Loan Application
          </h2>
          <p className="text-sm text-gray-600 mt-1">Fill out the form below to apply for a new loan</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">
                  Customer ID
                </label>
                <input
                  type="text"
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., cust_001"
                  required
                />
              </div>

              <div>
                <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700">
                  Loan Amount (Rs.)
                </label>
                <input
                  type="number"
                  id="loan_amount"
                  name="loan_amount"
                  value={formData.loan_amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="10000"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="loan_period_years" className="block text-sm font-medium text-gray-700">
                  Loan Period (Years)
                </label>
                <input
                  type="number"
                  id="loan_period_years"
                  name="loan_period_years"
                  value={formData.loan_period_years}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="2"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="interest_rate_yearly" className="block text-sm font-medium text-gray-700">
                  Interest Rate (% per year)
                </label>
                <input
                  type="number"
                  id="interest_rate_yearly"
                  name="interest_rate_yearly"
                  value={formData.interest_rate_yearly}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="10.5"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {preview && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">Loan Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Interest:</span>
                    <p className="font-semibold text-blue-900">Rs.{preview.totalInterest}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Amount:</span>
                    <p className="font-semibold text-blue-900">Rs.{preview.totalAmount}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Monthly EMI:</span>
                    <p className="font-semibold text-blue-900">Rs.{preview.monthlyEmi}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Processing...' : 'Submit Loan Application'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">Loan Approved!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p><strong>Loan ID:</strong> {result.loan_id}</p>
                    <p><strong>Customer ID:</strong> {result.customer_id}</p>
                    <p><strong>Total Amount Payable:</strong> Rs.{result.total_amount_payable}</p>
                    <p><strong>Monthly EMI:</strong> Rs.{result.monthly_emi}</p>
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

export default LoanApplication;