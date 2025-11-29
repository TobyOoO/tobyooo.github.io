

import React from 'react';
import ModalOverlay from './ModalOverlay';
import { GAME_FLOW_CONFIG } from '../../game/data/gameConfig';

interface ExitModalProps {
    onClose: () => void;
    currentHungriness: number;
    onGoToSchool: () => void;
    onLeave: () => void;
    hasLeftThisWeek: boolean;
}

const ExitModal = ({ onClose, currentHungriness, onGoToSchool, onLeave, hasLeftThisWeek }: ExitModalProps) => {
    const canGoToSchool = currentHungriness >= GAME_FLOW_CONFIG.lessonCost;

    return (
      <ModalOverlay onClose={onClose}>
        <div className="nes-dialog is-dark is-rounded" onClick={(e) => e.stopPropagation()}>
          <p className="title">出門</p>
          <p>你要去哪裡？</p>
          <div className="flex flex-col gap-4 mt-4">
              <button 
                  className={`nes-btn ${canGoToSchool ? 'is-primary' : 'is-disabled'}`} 
                  onClick={() => {
                      if (canGoToSchool) {
                          onGoToSchool();
                          onClose();
                      }
                  }}
              >
                  去上學
              </button>
              {!canGoToSchool && (
                  <p className="text-xs text-red-400">你太餓了，先吃點東西再出門。</p>
              )}
              
              <div className="flex flex-col gap-1">
                <button 
                    className={`nes-btn ${hasLeftThisWeek ? 'is-disabled' : 'is-success'}`} 
                    disabled={hasLeftThisWeek}
                    onClick={() => {
                        if (!hasLeftThisWeek) {
                            onLeave();
                            onClose();
                        }
                    }}
                >
                    離開這裡
                </button>
                {hasLeftThisWeek && (
                    <span className="text-xs text-gray-500 text-center">本週已經出去過了</span>
                )}
              </div>
          </div>
          <div className="mt-4 text-center">
              <button className="nes-btn is-error is-small" onClick={onClose}>取消</button>
          </div>
        </div>
      </ModalOverlay>
    );
};

export default ExitModal;