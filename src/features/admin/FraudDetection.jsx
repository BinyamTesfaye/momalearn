import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import FraudAlert from '../../components/admin/FraudAlert';

const FraudDetection = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load fraud alerts from API
    adminAPI.getFraudAlerts().then(setAlerts).catch(console.error);
  }, []);

  const handleResolve = (id) => {
    adminAPI.resolveFraudAlert(id).then(() => {
      setAlerts(alerts.filter(a => a.id !== id));
    });
  };

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Fraud Detection</h2>
      <FraudAlert alerts={alerts} onResolve={handleResolve} onDismiss={handleDismiss} />
    </div>
  );
};

export default FraudDetection;
