import { useState, useEffect } from 'react';
import axios from 'axios';

const HealthIndicator = () => {
    const [isHealthy, setIsHealthy] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await axios.get('http://localhost:3000/health');
                console.log("health:", res.data);
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
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
            ) : (
                <div
                    className={`h-4 w-4 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                    title={isHealthy ? 'API is healthy' : 'API is down'}
                ></div>
            )}
        </div>
    );
};

export default HealthIndicator;
