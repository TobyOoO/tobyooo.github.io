
import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Volume2, VolumeX, FileText, X } from 'lucide-react';
import { SystemAppProps } from './types';
import SaveManager from '../../../game/managers/SaveManager';

const SystemApp: React.FC<SystemAppProps> = ({ onCloseApp, volume, isMuted, onVolumeChange, onToggleMute }) => {
    const [showCredits, setShowCredits] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [creditsContent, setCreditsContent] = useState<string>('Loading...');
    const [saveStatus, setSaveStatus] = useState<string>('儲存遊戲');
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        if (isResetting) {
            // Wait for fade in animation (1s) then reset app state
            const timer = setTimeout(() => {
                SaveManager.clear();
                window.dispatchEvent(new CustomEvent('cmd-system-reset'));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isResetting]);

    const handleSaveGame = () => {
        const event = new CustomEvent('cmd-save-game');
        window.dispatchEvent(event);
        setSaveStatus('已儲存！');
        setTimeout(() => setSaveStatus('儲存遊戲'), 2000);
    };

    const handleRestartClick = () => {
        setShowResetConfirm(true);
    };

    const confirmRestart = () => {
        setShowResetConfirm(false); 
        setIsResetting(true);
    };

    const handleOpenCredits = async () => {
        setShowCredits(true);
        try {
            const response = await fetch('https://t.oby.tw/static/assets/credits.txt');
            if (response.ok) {
                const text = await response.text();
                setCreditsContent(text);
            } else {
                setCreditsContent("無法讀取名單 (Network Error)");
            }
        } catch (e) {
            setCreditsContent("無法讀取名單 (Fetch Error)");
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Resetting Overlay */}
            {isResetting && (
                <div className="fixed inset-0 bg-black z-[9999] animate-in fade-in duration-1000 flex items-center justify-center cursor-wait">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                        <p className="text-white text-sm font-bold tracking-widest animate-pulse">重新投胎中⋯⋯</p>
                    </div>
                </div>
            )}

            {/* Main System Menu */}
            {!showCredits && !showResetConfirm && (
                <div className="flex flex-col gap-4 p-4 items-center justify-center h-full w-full overflow-y-auto">
                    <h3 className="text-xl mb-2">系統設定</h3>
                    
                    <div className="w-full max-w-xs flex flex-col gap-4">
                        {/* Audio Controls Section */}
                        <div className="nes-container is-rounded is-dark p-4">
                            <p className="text-xs text-center mb-2" style={{ color: '#fff' }}>音效設定</p>
                            <div className="flex items-center gap-4 mb-2">
                                <button onClick={onToggleMute} className="nes-btn is-small p-1">
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={volume} 
                                    onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                                    className="nes-input is-success flex-1" 
                                    style={{padding: 0, height: '24px'}}
                                />
                            </div>
                        </div>

                        <button onClick={handleSaveGame} className={`nes-btn ${saveStatus === '已儲存！' ? 'is-success' : 'is-primary'} w-full flex items-center justify-center gap-2`}>
                            <Save size={16} /> {saveStatus}
                        </button>

                        <button onClick={handleOpenCredits} className="nes-btn is-warning w-full flex items-center justify-center gap-2">
                            <FileText size={16} /> 版權與鳴謝
                        </button>

                        <button onClick={handleRestartClick} className="nes-btn is-error w-full flex items-center justify-center gap-2">
                            <RotateCcw size={16} /> 原廠清除
                        </button>
                        
                        <button onClick={onCloseApp} className="nes-btn w-full">
                            返回
                        </button>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Overlay */}
            {showResetConfirm && (
                <div className="absolute inset-0 bg-gray-800 z-50 flex flex-col items-center justify-center p-4 text-center animate-in fade-in">
                    <div className="nes-container is-dark is-rounded">
                        <p className="title text-red-500">警告</p>
                        <p className="text-white mb-6 leading-loose text-sm">
                            你確定要清除目前遊戲進度，<br/>重新投胎來過嗎？
                        </p>
                        <div className="flex gap-4 w-full justify-center">
                            <button 
                                onClick={confirmRestart} 
                                className="nes-btn is-error"
                            >
                                確定
                            </button>
                            <button 
                                onClick={() => setShowResetConfirm(false)} 
                                className="nes-btn"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credits Modal Overlay */}
            {showCredits && (
                <div className="absolute inset-0 bg-gray-800 z-50 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                        <span className="text-sm font-bold text-yellow-500 flex items-center gap-2">
                            <FileText size={16} /> 版權與鳴謝
                        </span>
                        <button 
                            onClick={() => setShowCredits(false)} 
                            className="nes-btn is-error is-small p-0 px-2 flex items-center"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    
                    <div className="flex-1 bg-black/40 p-4 rounded border-2 border-gray-600 overflow-y-auto text-xs leading-loose whitespace-pre-wrap font-mono text-gray-300">
                        {creditsContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemApp;
