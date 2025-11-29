
import React from 'react';
import ModalOverlay from './ModalOverlay';

interface Props {
  onClose: () => void;
  onConfirm?: () => void;
}

const BedModal: React.FC<Props> = ({ onClose, onConfirm }) => (
  <ModalOverlay onClose={onClose}>
    <div className="nes-dialog is-dark is-rounded" onClick={(e) => e.stopPropagation()}>
      <p className="title">休息</p>
      <p>現在想睡覺嗎？</p>
      <div className="dialog-menu flex justify-end gap-4 mt-4">
        <button className="nes-btn is-primary" onClick={() => {
            if (onConfirm) onConfirm();
            onClose();
        }}>爆睡</button>
        <button className="nes-btn" onClick={onClose}>不要</button>
      </div>
    </div>
  </ModalOverlay>
);

export default BedModal;
