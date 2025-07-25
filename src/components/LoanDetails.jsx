import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import { getLoanLedger } from '../services/api';

const LoanDetails = ({ loanId }) => {
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLedger = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getLoanLedger(id);
      setLedgerData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch loan details');
      setLedgerData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loanId) {
      fetchLedger(loanId);
    }
  }, [loanId]);

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'EMI':
        return 'bg-blue-100 text-blue-800';
      case 'LUMP_SUM':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!loanId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Loan Selected</h3>
        <p className="text-gray-600">Please select a loan from the Customer Dashboard to view details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Loan Details</h2>
          </div>
          {loanId && (
            <span className="text-sm text-gray-600">Loan ID: {loanId}</span>
          )}
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {ledgerData && (
        <div className="space-y-6">
          {/* Loan Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">Principal Amount</p>
                <p className="text-2xl font-bold text-blue-900">Rs.{ledgerData.principal}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">Amount Paid</p>
                <p className="text-2xl font-bold text-green-900">Rs.{ledgerData.amount_paid.toFixed(2)}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-700">Balance Amount</p>
                <p className="text-2xl font-bold text-amber-900">Rs.{ledgerData.balance_amount.toFixed(2)}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700">Monthly EMI</p>
                <p className="text-2xl font-bold text-purple-900">Rs.{ledgerData.monthly_emi.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-lg font-semibold text-gray-900">Rs.{ledgerData.total_amount}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Customer ID:</span>
                <span className="text-sm font-medium text-gray-900">{ledgerData.customer_id}</span>
              </div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((ledgerData.amount_paid / ledgerData.total_amount) * 100, 100)}%` 
                }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {((ledgerData.amount_paid / ledgerData.total_amount) * 100).toFixed(1)}% Completed
              </span>
              <span>
                Rs.{ledgerData.balance_amount} Remaining
              </span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            </div>
            
            {ledgerData.transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {ledgerData.transactions.map((transaction) => (
                  <div key={transaction.payment_id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentTypeColor(transaction.payment_type)}`}>
                            {transaction.payment_type}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            ID: {transaction.payment_id}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(transaction.payment_date)}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          Rs.{parseFloat(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;