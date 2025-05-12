import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabase';

const LoanForm = ({ onSubmitSuccess }) => {
  const initialFormData = {
    age: '',
    income: '',
    loan_amount: '',
    credit_score: '',
    debt_to_income_ratio: '',
    employment_years: '',
    savings_balance: '',
    existing_loans: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert string values to appropriate types
      const processedData = {
        age: parseInt(formData.age),
        income: parseFloat(formData.income),
        loan_amount: parseFloat(formData.loan_amount),
        credit_score: parseInt(formData.credit_score),
        debt_to_income_ratio: parseFloat(formData.debt_to_income_ratio),
        employment_years: parseInt(formData.employment_years),
        savings_balance: parseFloat(formData.savings_balance),
        existing_loans: parseInt(formData.existing_loans)
      };

      // Submit to API
      const response = await axios.post('http://localhost:3000/loan', processedData);
      
      // Store in Supabase
      const { error: supabaseError } = await supabase
        .from('loans')
        .insert([{
          ...processedData,
          risk_score: response.data.risk_score,
          approval_status: response.data.approval_status
        }]);
      
      if (supabaseError) throw supabaseError;
      
      setSuccess('Loan application submitted successfully!');
      setFormData(initialFormData);
      
      // Notify parent component to refresh the table
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while submitting the loan application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Application</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income ($)
            </label>
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount ($)
            </label>
            <input
              type="number"
              id="loan_amount"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="credit_score" className="block text-sm font-medium text-gray-700 mb-1">
              Credit Score
            </label>
            <input
              type="number"
              id="credit_score"
              name="credit_score"
              value={formData.credit_score}
              onChange={handleChange}
              required
              min="300"
              max="850"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="debt_to_income_ratio" className="block text-sm font-medium text-gray-700 mb-1">
              Debt-to-Income Ratio
            </label>
            <input
              type="number"
              id="debt_to_income_ratio"
              name="debt_to_income_ratio"
              value={formData.debt_to_income_ratio}
              onChange={handleChange}
              required
              min="0"
              max="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="employment_years" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Employment
            </label>
            <input
              type="number"
              id="employment_years"
              name="employment_years"
              value={formData.employment_years}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="savings_balance" className="block text-sm font-medium text-gray-700 mb-1">
              Savings Balance ($)
            </label>
            <input
              type="number"
              id="savings_balance"
              name="savings_balance"
              value={formData.savings_balance}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="existing_loans" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Existing Loans
            </label>
            <input
              type="number"
              id="existing_loans"
              name="existing_loans"
              value={formData.existing_loans}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {loading ? 'Submitting...' : 'Submit Loan Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;