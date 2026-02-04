import React, { createContext, useContext, useState, useRef } from 'react';

// Create the Context
const ConfirmDialogContext = createContext();

// Create the Provider Component
export const ConfirmDialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  // We use a ref to keep track of the resolve function of the Promise
  const resolveRef = useRef(null);

  /**
   * This is the function you will call in your components.
   * It returns a Promise that resolves to true (Po) or false (No).
   */
  const confirm = (msg) => {
    setMessage(msg);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolveRef.current(true); // User clicked Po
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolveRef.current(false); // User clicked No
    setIsOpen(false);
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      
      {/* The Global Modal UI */}
      {isOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content">
            <p>{message}</p>
            <div className="confirm-modal-actions">
              <button className="btn-deny" onClick={handleCancel}>Jo</button>
              <button className="btn-confirm" onClick={handleConfirm}>Po</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};

// Custom Hook for easy usage
export const useConfirm = () => {
  return useContext(ConfirmDialogContext);
};