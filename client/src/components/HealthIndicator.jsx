import { useState, useEffect } from 'react';
import axios from 'axios';

const HealthIndicator = () => {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axios.get('http://localhost:3000/health');
        setIsHealthy(true);
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <div className="mr-2 text-sm text-gray-600">API Status:</div>
      {isLoading ? (
        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
      ) : (
        <div
          className={`h-3 w-3 rounded-full ${
            isHealthy ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={isHealthy ? 'API is healthy' : 'API is down'}
        ></div>
      )}
    </div>
  );
};

export default HealthIndicator;