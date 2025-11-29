
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, XCircle, Search, Globe, Lock, ShoppingBag } from 'lucide-react';
import { BaseAppProps } from './types';
import { NOVEL_LINK } from '../../../game/constants';

type Tab = 'novel' | 'google' | 'facebook' | 'youtube';

const BrowserApp: React.FC<BaseAppProps> = ({ onCloseApp }) => {
    const [activeTab, setActiveTab] = useState<Tab>('novel');
    const [isLoading, setIsLoading] = useState(false);

    const handleTabChange = (tab: Tab) => {
        if (tab === activeTab) return;
        setIsLoading(true);
        setActiveTab(tab);
        setTimeout(() => setIsLoading(false), 800); // Fake loading time
    };

    const getUrl = () => {
        switch (activeTab) {
            case 'google': return 'https://www.google.com';
            case 'facebook': return 'https://www.facebook.com';
            case 'youtube': return 'https://www.youtube.com';
            case 'novel': return NOVEL_LINK;
        }
    };

    const trackClick = (loc: string) => {
        try {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({ event: 'NovelClick', location: loc });
        } catch(e) {}
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                    <RefreshCw size={32} className="animate-spin" />
                    <span className="text-xs">正在連接主機...</span>
                </div>
            );
        }

        if (activeTab === 'novel') {
            return (
                <div className="flex flex-col h-full bg-white text-black font-sans overflow-y-auto">
                    {/* Yahoo Kimo style Header */}
                    <div className="bg-[#400090] text-white p-2 px-4 flex items-center gap-2 shrink-0">
                        <span className="font-bold text-lg italic">Kihoo!</span>
                        <span className="text-sm">奇摸子</span>
                        <div className="flex-1 ml-4 bg-white h-6 flex items-center px-2">
                             <span className="text-gray-400 text-xs">搜尋網頁...</span>
                        </div>
                        <button className="bg-yellow-400 text-black text-xs px-2 py-0.5 font-bold">搜尋</button>
                    </div>

                    {/* Navbar */}
                    <div className="bg-[#f1f1f1] border-b border-gray-300 p-1 flex gap-4 text-xs text-blue-800 font-bold px-4 shrink-0">
                        <span>首頁</span>
                        <span>新聞</span>
                        <span>股市</span>
                        <span className="text-red-600">拍賣</span>
                        <span>娛樂</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex gap-4 min-h-0">
                        {/* Sidebar */}
                        <div className="w-1/4 hidden sm:block text-xs space-y-2 text-blue-700 underline shrink-0">
                            <div>今日焦點</div>
                            <div>熱門搜尋</div>
                            <div>影音播放</div>
                            <div className="h-px bg-gray-300 my-2"></div>
                            <div>購物中心</div>
                            <div>拍賣</div>
                        </div>

                        {/* Main Ad */}
                        <div className="flex-1 overflow-y-auto">
                            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b-2 border-orange-500 pb-1">
                                <span className="text-white bg-orange-500 px-1 mr-2">HOT</span>
                                網路暢銷小說排行榜 NO.1
                            </h2>
                            
                            <div className="border border-gray-300 p-4 bg-yellow-50 flex flex-col items-center text-center">
                                <h3 className="text-xl font-black text-red-600 mb-2">《台孩危機》</h3>
                                <a 
                                    href={NOVEL_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="nes-btn is-warning w-full max-w-xs animate-pulse text-black text-center block"
                                    style={{ textDecoration: 'none', touchAction: 'auto' }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => trackClick('BrowserTop')}
                                >
                                    立即搶購 &gt;&gt;
                                </a>
                                <p className="text-sm text-gray-700 mb-4 font-bold">
                                    揭露台商子女的辛酸血淚，真實故事改編！
                                </p>
                                
                                <div className="w-full bg-white border border-gray-300 p-4 mb-4 text-left text-xs text-gray-600 leading-relaxed shadow-inner">
                                    <p className="mb-2">「讀著小說，你發現你也是故事的一部分...」</p>
                                    <p>網友 <span className="text-blue-600">煞氣a瑞翔</span> 推薦：「太神啦！這根本就是我家的故事！」</p>
                                    <p>論壇熱議，今年必讀的神作。</p>
                                </div>

                                <a 
                                    href={NOVEL_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="nes-btn is-warning w-full max-w-xs animate-pulse text-black text-center block"
                                    style={{ textDecoration: 'none', touchAction: 'auto' }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => trackClick('BrowserBottom')}
                                >
                                    立即搶購 &gt;&gt;
                                </a>
                                <p className="text-[10px] text-gray-400 mt-2">*外部連結，點擊將開啟新視窗</p>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-blue-800 underline">
                                 <div>[新聞] 台商學校驚傳...</div>
                                 <div>[娛樂] 杰倫新專輯銷量...</div>
                                 <div>[生活] 珍珠奶茶這裡買...</div>
                                 <div>[財經] 股市大盤解析...</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white font-sans text-gray-800">
                <div className="mb-6">
                    <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">無法顯示此網頁</h1>
                    <p className="text-gray-500 text-sm mb-6">連接被重置 (Connection Reset)</p>
                </div>

                <div className="text-left max-w-md bg-gray-100 p-4 rounded border border-gray-300 text-xs text-gray-600 space-y-2">
                    <p><strong>可能的原因：</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>網站暫時無法使用或太過忙碌。</li>
                        <li>如果您無法載入任何頁面，請檢查您的電腦的網路連線。</li>
                        <li>該網域可能已被<span className="text-red-600 font-bold">相關法律法規</span>屏蔽。</li>
                    </ul>
                    <p className="mt-4 pt-2 border-t border-gray-300 font-mono text-gray-400">
                        Error Code: ERR_CONNECTION_RESET_BY_PEER
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#d4d4d4]">
            {/* Browser Header / Controls */}
            <div className="bg-[#c0c0c0] border-b-2 border-gray-500 p-1 flex items-center gap-2 shrink-0">
                <button className="nes-btn px-2 py-0" onClick={onCloseApp}>
                   <ArrowLeft size={16} />
                </button>
                <div className="flex gap-1">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center border border-gray-500 opacity-50">
                        <ArrowLeft size={12} />
                    </div>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center border border-gray-500 opacity-50">
                        <RefreshCw size={12} />
                    </div>
                </div>
                
                {/* URL Bar */}
                <div className="flex-1 bg-white border-2 border-gray-400 h-8 flex items-center px-2 gap-2 shadow-inner">
                    <Lock size={12} className="text-green-600" />
                    <span className="text-xs font-mono truncate flex-1">{getUrl()}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-2 pt-2 bg-[#d4d4d4] border-b border-gray-400 shrink-0 overflow-x-auto">
                <button 
                    onClick={() => handleTabChange('novel')}
                    className={`
                        px-4 py-1 rounded-t text-xs font-bold border-t-2 border-x-2 flex items-center gap-1 whitespace-nowrap
                        ${activeTab === 'novel' ? 'bg-white border-gray-400 text-purple-600 relative top-[1px]' : 'bg-[#e0e0e0] border-transparent text-gray-500 hover:bg-gray-200'}
                    `}
                >
                    <ShoppingBag size={12} /> 小說商城
                </button>
                <button 
                    onClick={() => handleTabChange('google')}
                    className={`
                        px-4 py-1 rounded-t text-xs font-bold border-t-2 border-x-2 flex items-center gap-1 whitespace-nowrap
                        ${activeTab === 'google' ? 'bg-white border-gray-400 text-blue-600 relative top-[1px]' : 'bg-[#e0e0e0] border-transparent text-gray-500 hover:bg-gray-200'}
                    `}
                >
                    <Search size={12} /> Google
                </button>
                <button 
                    onClick={() => handleTabChange('facebook')}
                    className={`
                        px-4 py-1 rounded-t text-xs font-bold border-t-2 border-x-2 flex items-center gap-1 whitespace-nowrap
                        ${activeTab === 'facebook' ? 'bg-white border-gray-400 text-blue-800 relative top-[1px]' : 'bg-[#e0e0e0] border-transparent text-gray-500 hover:bg-gray-200'}
                    `}
                >
                    <span className="font-serif font-bold italic">f</span> Facebook
                </button>
                <button 
                    onClick={() => handleTabChange('youtube')}
                    className={`
                        px-4 py-1 rounded-t text-xs font-bold border-t-2 border-x-2 flex items-center gap-1 whitespace-nowrap
                        ${activeTab === 'youtube' ? 'bg-white border-gray-400 text-red-600 relative top-[1px]' : 'bg-[#e0e0e0] border-transparent text-gray-500 hover:bg-gray-200'}
                    `}
                >
                    <Globe size={12} /> YouTube
                </button>
            </div>

            {/* Viewport */}
            <div className="flex-1 bg-white border-x-2 border-b-2 border-gray-400 m-2 mt-0 shadow-inner overflow-hidden relative">
                {renderContent()}
                
                {activeTab !== 'novel' && (
                    <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none rotate-[-15deg]">
                        <span className="text-6xl font-black text-red-600 border-4 border-red-600 p-2 rounded">
                            404
                        </span>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="bg-[#c0c0c0] border-t border-gray-400 px-2 py-0.5 text-[10px] text-gray-600 flex justify-between shrink-0">
                <span>Done</span>
                <span>Internet Zone</span>
            </div>
        </div>
    );
};

export default BrowserApp;
