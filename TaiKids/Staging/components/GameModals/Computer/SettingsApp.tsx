
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SettingsAppProps } from './types';

const SettingsApp: React.FC<SettingsAppProps> = ({ volume, isMuted, onVolumeChange, onToggleMute, onCloseApp }) => {
    return (
        <div className="flex flex-col gap-6 p-4 items-center justify-center h-full">
            <h3 className="text-xl mb-4">音效設定</h3>
            
            <div className="nes-container is-rounded is-dark w-full max-w-xs text-center">
                 <div className="mb-4">
                    {isMuted || volume === 0 ? <VolumeX size={48} className="mx-auto text-red-500"/> : <Volume2 size={48} className="mx-auto text-green-500"/>}
                 </div>
                 
                 <div className="mb-4">
                     <label className="text-xs mb-2 block">主音量: {isMuted ? '靜音' : volume}</label>
                     <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={volume} 
                         onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                         className="nes-input is-success" 
                         style={{padding: 0, height: '24px'}}
                     />
                 </div>

                 <button 
                    onClick={onToggleMute} 
                    className={`nes-btn is-small ${isMuted ? 'is-error' : 'is-success'}`}
                 >
                     {isMuted ? '取消靜音' : '靜音'}
                 </button>
            </div>

            <button onClick={onCloseApp} className="nes-btn">
                返回
            </button>
        </div>
    );
};

export default SettingsApp;
