'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Alert from './Alert';
import ConfirmModal from './ConfirmModal';

interface AlertData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ConfirmData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'info' | 'warning' | 'error';
}

interface AlertContextType {
  showAlert: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      onCancel?: () => void;
      type?: 'info' | 'warning' | 'error';
    }
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [confirmData, setConfirmData] = useState<ConfirmData | null>(null);

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: AlertData = { id, message, type, duration };
    
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      onCancel?: () => void;
      type?: 'info' | 'warning' | 'error';
    }
  ) => {
    setConfirmData({
      message,
      onConfirm,
      title: options?.title,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      onCancel: options?.onCancel,
      type: options?.type || 'info',
    });
  };

  const hideConfirm = () => {
    setConfirmData(null);
  };

  const handleConfirm = () => {
    if (confirmData) {
      confirmData.onConfirm();
      hideConfirm();
    }
  };

  const handleCancel = () => {
    if (confirmData?.onCancel) {
      confirmData.onCancel();
    }
    hideConfirm();
  };

  const showSuccess = (message: string, duration = 5000) => showAlert(message, 'success', duration);
  const showError = (message: string, duration = 5000) => showAlert(message, 'error', duration);
  const showWarning = (message: string, duration = 5000) => showAlert(message, 'warning', duration);
  const showInfo = (message: string, duration = 5000) => showAlert(message, 'info', duration);

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo, showConfirm }}>
      {children}
      {/* Render alerts */}
      <div className="alert-container">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            style={{
              position: 'fixed',
              top: `${20 + index * 80}px`, // Stack alerts vertically
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000 + index,
              width: '100%',
              maxWidth: '28rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            <Alert
              message={alert.message}
              type={alert.type}
              isVisible={true}
              onClose={() => removeAlert(alert.id)}
              duration={alert.duration}
            />
          </div>
        ))}
      </div>
      
      {/* Render confirmation modal */}
      {confirmData && (
        <ConfirmModal
          isVisible={true}
          title={confirmData.title}
          message={confirmData.message}
          confirmText={confirmData.confirmText}
          cancelText={confirmData.cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          type={confirmData.type}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}