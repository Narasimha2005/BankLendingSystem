import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, User, Building2 } from 'lucide-react';
import LoanApplication from './components/LoanApplication';
import PaymentForm from './components/PaymentForm';
import CustomerDashboard from './components/CustomerDashboard';
import LoanDetails from './components/LoanDetails';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const tabs = [
    { id: 'dashboard', name: 'Customer Dashboard', icon: User },
    { id: 'apply', name: 'Apply for Loan', icon: FileText },
    { id: 'payment', name: 'Make Payment', icon: CreditCard },
    { id: 'details', name: 'Loan Details', icon: DollarSign }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CustomerDashboard onSelectLoan={setSelectedLoanId} />;
      case 'apply':
        return <LoanApplication />;
      case 'payment':
        return <PaymentForm />;
      case 'details':
        return <LoanDetails loanId={selectedLoanId} />;
      default:
        return <CustomerDashboard onSelectLoan={setSelectedLoanId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
            </div>
            <div className="text-sm text-gray-500">
              Loan Management System
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;