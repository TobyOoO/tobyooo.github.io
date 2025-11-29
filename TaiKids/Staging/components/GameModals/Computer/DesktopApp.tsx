
import React from 'react';
import { MessageSquare, Save, Globe, Image } from 'lucide-react';
import { AppType, DesktopAppProps } from './types';

const DesktopApp: React.FC<DesktopAppProps> = ({ onOpenApp, currentWeek }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="grid grid-cols-2 gap-8">
                <button 
                    onClick={() => onOpenApp('QQ')} 
                    disabled={currentWeek <= 1}
                    className={`nes-btn flex flex-col items-center justify-center w-32 h-32 ${currentWeek <= 1 ? 'is-disabled' : 'is-primary'}`}
                >
                    <MessageSquare size={32} className="mb-2" />
                    <span className="text-xs">iQQ 通信</span>
                </button>
                
                <button 
                    onClick={() => onOpenApp('ALBUM')} 
                    className="nes-btn is-warning flex flex-col items-center justify-center w-32 h-32"
                >
                    <Image size={32} className="mb-2" />
                    <span className="text-xs">相簿</span>
                </button>

                <button 
                    onClick={() => onOpenApp('SYSTEM')} 
                    className="nes-btn is-error flex flex-col items-center justify-center w-32 h-32"
                >
                    <Save size={32} className="mb-2" />
                    <span className="text-xs">系統</span>
                </button>

                <button 
                    onClick={() => onOpenApp('BROWSER')} 
                    className="nes-btn is-primary flex flex-col items-center justify-center w-32 h-32"
                >
                    <Globe size={32} className="mb-2" />
                    <span className="text-xs">上網</span>
                </button>
            </div>
            
        </div>
    );
};

export default DesktopApp;
