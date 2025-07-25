import React, { useState, useEffect } from 'react';
import { User, Search, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { getCustomerOverview } from '../services/api';

const CustomerDashboard = ({ onSelectLoan }) => {
  const [customerId, setCustomerId] = useState('cust_001');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomerData = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCustomerOverview(id);
      setCustomerData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch customer data');
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData(customerId);
  }, [customerId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAID_OFF':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Clock className="h-4 w-4" />;
      case 'PAID_OFF':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Customer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Customer Lookup</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter customer ID (e.g., cust_001)"
            />
          </div>
          <button
            onClick={() => fetchCustomerData(customerId)}
            disabled={loading || !customerId}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* Customer Overview */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {customerData && (
        <div className="space-y-6">
          {/* Customer Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Overview</h3>
                <p className="text-sm text-gray-600">Customer ID: {customerData.customer_id}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{customerData.total_loans}</p>
                <p className="text-sm text-gray-600">Total Loans</p>
              </div>
            </div>
          </div>

          {/* Loans List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Loans</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {customerData.loans.map((loan) => (
                <div key={loan.loan_id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Loan ID: {loan.loan_id}
                        </h4>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                          {getStatusIcon(loan.status)}
                          <span className="ml-1">{loan.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Principal:</span>
                          <p className="font-medium">Rs.{loan.principal_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <p className="font-medium">Rs.{loan.total_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly EMI:</span>
                          <p className="font-medium">Rs.{loan.monthly_emi.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">EMIs Left:</span>
                          <p className="font-medium">{loan.emis_left}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <span className="text-xs text-gray-500">
                          Interest Rate: {loan.interest_rate}% | 
                          Period: {loan.loan_period_years} years
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onSelectLoan(loan.loan_id)}
                      className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;