import React from 'react';

const ModalOverlay = ({ children, onClose }: { children?: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={(e) => {
    // Close when clicking outside the content
    if (e.target === e.currentTarget) onClose();
  }}>
    {children}
  </div>
);

export default ModalOverlay;