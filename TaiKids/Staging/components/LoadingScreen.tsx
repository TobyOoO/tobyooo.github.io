
import React, { useEffect, useState } from 'react';
import { ASSET_VERSION } from '../game/constants.ts'

interface Props {
  progress: number;
  isLoading: boolean;
  onStart: () => void;
}

const LoadingScreen: React.FC<Props> = ({ progress, isLoading, onStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
      setIsExiting(true);
      setTimeout(() => {
          onStart();
      }, 1000); // Wait for fade out
  };

  return (
    <div 
        className={`fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col items-center justify-center pixel-font text-white transition-opacity duration-1000 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="mb-8 text-2xl animate-pulse text-green-500" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
        台孩兒養成器
      </div>
      
      <div className="w-64 h-8 border-4 border-white p-1 rounded-sm bg-gray-900 mb-4">
        <div 
          className="h-full bg-green-500 transition-all duration-200 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex justify-between w-64 text-xs text-gray-400 font-mono mb-8">
        <span>初始化養成器中⋯⋯</span>
        <span>{progress}%</span>
      </div>

      {!isLoading && !isExiting && (
          <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
              <button 
                  onClick={handleStart}
                  className="nes-btn is-primary"
              >
                  開啟養成器
              </button>
              
              <div className="text-center text-xs text-gray-500 leading-relaxed mt-4 bg-black/30 p-4 rounded border border-gray-800">
                  <p>遊戲進度將儲存於瀏覽器中。</p>
                  <p className="text-red-400">無痕模式將導致遊戲進度無法儲存。</p>
              </div>
          </div>
      )}

      <div className="absolute bottom-12 text-[10px] text-gray-600 animate-bounce justify-center">
         Crisis of Kids at Strait (CKS) - v.{ASSET_VERSION} <br/>
         台孩製作委員會・小說《台孩危機》衍生作品<br/>
         創用條款 4.0 姓名標示-相同分享方式 授權
      </div>
    </div>
  );
};

export default LoadingScreen;
