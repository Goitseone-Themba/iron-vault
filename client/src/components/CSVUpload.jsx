import { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { supabase } from '../supabase';

const CSVUpload = ({ onSubmitSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid CSV file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse CSV file
      const results = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results),
          error: (error) => reject(error)
        });
      });

      // Validate CSV structure
      const requiredColumns = [
        'age', 'income', 'loan_amount', 'credit_score', 
        'debt_to_income_ratio', 'employment_years', 
        'savings_balance', 'existing_loans'
      ];
      
      const csvColumns = Object.keys(results.data[0] || {});
      const missingColumns = requiredColumns.filter(col => !csvColumns.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`CSV is missing required columns: ${missingColumns.join(', ')}`);
      }

      // Process data
      const processedData = results.data.map(row => ({
        age: parseInt(row.age),
        income: parseFloat(row.income),
        loan_amount: parseFloat(row.loan_amount),
        credit_score: parseInt(row.credit_score),
        debt_to_income_ratio: parseFloat(row.debt_to_income_ratio),
        employment_years: parseInt(row.employment_years),
        savings_balance: parseFloat(row.savings_balance),
        existing_loans: parseInt(row.existing_loans)
      }));

      // Submit to API
      const response = await axios.post('http://localhost:3000/batch', processedData);
      
      // Store in Supabase
      const supabaseData = response.data.map((item, index) => ({
        ...processedData[index],
        risk_score: item.risk_score,
        approval_status: item.approval_status
      }));
      
      const { error: supabaseError } = await supabase
        .from('loans')
        .insert(supabaseData);
      
      if (supabaseError) throw supabaseError;
      
      setSuccess(`Successfully processed ${processedData.length} loan applications.`);
      setFile(null);
      
      // Reset file input
      document.getElementById('csv-file').value = '';
      
      // Notify parent component to refresh the table
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while processing the CSV file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Batch Upload</h2>
      
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
        <div className="mb-4">
          <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-1">
            Upload CSV File
          </label>
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
          <p className="mt-2 text-sm text-gray-500">
            CSV format: age,income,loan_amount,credit_score,debt_to_income_ratio,employment_years,savings_balance,existing_loans
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-rose-400"
          >
            {loading ? 'Processing...' : 'Upload and Process'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CSVUpload;
