
import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import { Monitor } from 'lucide-react';
import { AppType } from './Computer/types';
import DesktopApp from './Computer/DesktopApp';
import QQApp from './Computer/QQApp';
import SystemApp from './Computer/SystemApp';
import AlbumApp from './Computer/AlbumApp';
import BrowserApp from './Computer/BrowserApp';
import { EndingHistoryItem } from '../../game/data/endingData';
import { Gender } from './NamePicker';

interface Props {
    onClose: () => void;
    currentWeek: number;
    gender: Gender;
    playerCloseness: number;
    onUpdateCloseness: (delta: number) => void;
    endingHistory: EndingHistoryItem[];
    chatHistory: Record<string, { choiceIndex: number, timestamp: number }>;
}

const ComputerModal: React.FC<Props> = ({ onClose, currentWeek, gender, playerCloseness, onUpdateCloseness, endingHistory, chatHistory }) => {
    // --- Global Computer State ---
    const [activeApp, setActiveApp] = useState<AppType>('DESKTOP');
    
    // Audio Settings can remain session-based
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);

    const handleChatReply = (scenarioId: string, replyIndex: number, closenessDelta: number) => {
        // Dispatch event to persist chat history in PlayerStats
        window.dispatchEvent(new CustomEvent('cmd-update-chat-history', {
            detail: { scenarioId, choiceIndex: replyIndex }
        }));
        
        // Update closeness via existing callback
        onUpdateCloseness(closenessDelta);
    };

    const renderApp = () => {
        switch (activeApp) {
            case 'QQ':
                return <QQApp 
                    currentWeek={currentWeek} 
                    gender={gender}
                    onCloseApp={() => setActiveApp('DESKTOP')}
                    chatHistory={chatHistory}
                    onChatReply={handleChatReply}
                />;
            case 'SYSTEM':
                return <SystemApp 
                    onCloseApp={() => setActiveApp('DESKTOP')} 
                    volume={volume}
                    isMuted={isMuted}
                    onVolumeChange={setVolume}
                    onToggleMute={() => setIsMuted(!isMuted)}
                />;
            case 'BROWSER':
                return <BrowserApp 
                    onCloseApp={() => setActiveApp('DESKTOP')} 
                />;
            case 'ALBUM':
                return <AlbumApp 
                    endingHistory={endingHistory}
                    onCloseApp={() => setActiveApp('DESKTOP')}
                />;
            case 'DESKTOP':
            default:
                return <DesktopApp 
                    currentWeek={currentWeek} 
                    onOpenApp={setActiveApp} 
                />;
        }
    };

    const getTaskbarTitle = () => {
        switch (activeApp) {
            case 'DESKTOP': return '桌面';
            case 'ALBUM': return '相簿';
            case 'QQ': return 'iQQ 通信';
            case 'SYSTEM': return '系統';
            case 'BROWSER': return '瀏覽器';
            default: return activeApp;
        }
    };

    return (
      <ModalOverlay onClose={onClose}>
        <div className="nes-container is-dark is-rounded w-full max-w-lg h-[600px] flex flex-col p-0 overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            {/* Title Bar */}
            <div className="bg-gray-800 p-2 border-b-4 border-gray-700 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <Monitor size={16} />
                    <span className="text-xs">我的電腦</span>
                </div>
                <button onClick={onClose} className="nes-btn is-error is-small py-0 px-2">X</button>
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-[#209cee] relative overflow-hidden flex flex-col p-4">
                {renderApp()}
            </div>
            
            {/* Taskbar */}
            <div className="bg-gray-200 border-t-4 border-white p-1 flex items-center gap-2">
                <button 
                    onClick={() => {
                        if (activeApp === 'DESKTOP') {
                            onClose();
                        } else {
                            setActiveApp('DESKTOP');
                        }
                    }}
                    className={`nes-btn is-small ${activeApp === 'DESKTOP' ? 'is-error' : 'is-primary'}`}
                >
                    {activeApp === 'DESKTOP' ? '關機' : '桌面'}
                </button>
                <div className="flex-1 bg-gray-400 border-2 border-gray-500 inset-shadow h-8 flex items-center px-2">
                    <span className="text-xs text-black truncate">
                        {getTaskbarTitle()}
                    </span>
                </div>
                <div className="bg-gray-200 border-2 border-gray-400 px-2 h-8 flex items-center">
                    <span className="text-xs text-black">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
        </div>
      </ModalOverlay>
    );
};

export default ComputerModal;
