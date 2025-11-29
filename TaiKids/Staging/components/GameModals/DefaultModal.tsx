
import React from 'react';
import ModalOverlay from './ModalOverlay';

const DefaultModal = ({ id, onClose }: { id: string, onClose: () => void }) => (
    <ModalOverlay onClose={onClose}>
        <div className="nes-container is-dark is-rounded">
            <p>Interacted with {id}</p>
            <button className="nes-btn" onClick={onClose}>Close</button>
        </div>
    </ModalOverlay>
);

export default DefaultModal;
