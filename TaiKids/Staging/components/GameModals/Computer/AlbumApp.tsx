
import React, { useState } from 'react';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import { AlbumAppProps } from './types';
import { getEndingStory, ENDING_STORIES } from '../../../game/data/endingData';
import { ASSET_VERSION } from '../../../game/constants';

const AlbumApp: React.FC<AlbumAppProps> = ({ endingHistory, onCloseApp }) => {
    const [selectedEndingId, setSelectedEndingId] = useState<string | null>(null);

    const selectedEnding = endingHistory.find(h => h.id === selectedEndingId);
    const selectedStory = selectedEnding ? getEndingStory(selectedEnding.id) : null;

    if (selectedEnding && selectedStory) {
        // Detail View
        return (
             <div className="flex flex-col h-full bg-black/80 backdrop-blur text-white absolute inset-0 z-20">
                 <div className="flex items-center gap-2 p-2 border-b border-gray-600 bg-gray-900">
                    <button className="nes-btn is-error px-2 py-0" onClick={() => setSelectedEndingId(null)}>
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-sm font-bold text-yellow-500">{selectedStory.title}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
                    <div className="w-full max-w-sm border-4 border-white mb-4 bg-black">
                         <img 
                            src={`https://t.oby.tw/static/assets/endings/${selectedEnding.id}-min.png?version=${ASSET_VERSION}`}
                            alt={selectedStory.title}
                            className="w-full h-auto"
                        />
                    </div>
                    
                    <div className="nes-container is-dark is-rounded w-full max-w-sm mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 border-b border-gray-700 pb-1">
                            <span>Week {selectedEnding.week}</span>
                            <span>{new Date(selectedEnding.timestamp).toLocaleDateString()}</span>
                        </div>
                         <p className="text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: selectedStory.content }} />
                    </div>

                    <div className="w-full max-w-sm flex gap-2 text-xs text-gray-500 justify-center">
                        <span className="border border-gray-600 px-2 rounded">學業: {selectedEnding.academicRanking}</span>
                        <span className="border border-gray-600 px-2 rounded">T值: {selectedEnding.tValue}</span>
                    </div>
                </div>
             </div>
        );
    }

    // Grid View
    const percentage = Math.round((endingHistory.length / ENDING_STORIES.length) * 100);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <div className="flex items-center gap-2 p-2 border-b-4 border-gray-300 bg-white">
                <button className="nes-btn px-2 py-0" onClick={onCloseApp}>
                   <ArrowLeft size={16} />
                </button>
                <span className="text-sm font-bold text-gray-600">
                    相簿
                </span>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-3 bg-gray-200 border-b border-gray-300">
                 <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                     <span>收集進度</span>
                     <span>已解鎖: {endingHistory.length}</span>
                 </div>
                 <div className="w-full h-4 bg-white border-2 border-gray-400 p-[1px]">
                     <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }} 
                     />
                 </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-2">
                {endingHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                         <i className="nes-icon is-large is-transparent close"></i>
                         <p className="text-xs">尚無結局記錄</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {endingHistory.map((item) => {
                            const story = getEndingStory(item.id);
                            if (!story) return null;

                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => setSelectedEndingId(item.id)}
                                    className="nes-container is-rounded p-1 bg-white cursor-pointer hover:border-blue-500 group flex flex-col"
                                >
                                    <div className="aspect-video bg-gray-200 mb-2 overflow-hidden relative border-b-2 border-gray-100">
                                         <img 
                                            src={`https://t.oby.tw/static/assets/endings/${item.id}-min.png?version=${ASSET_VERSION}`}
                                            alt={story.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100" size={20} />
                                        </div>
                                    </div>
                                    <div className="text-center mt-auto">
                                        <p className="text-xs font-bold text-gray-800 truncate px-1">{story.title}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumApp;
