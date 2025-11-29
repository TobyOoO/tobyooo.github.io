
import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryHistoryItem } from '../../game/entities/PlayerStats';
import { NOVEL_LINK } from '../../game/constants';
import { Gender } from './NamePicker';

interface Props {
  onClose: () => void;
  storyHistory?: StoryHistoryItem[];
  gender?: Gender;
}

const DeskModal: React.FC<Props> = ({ onClose, storyHistory = [], gender = 'neutral' }) => {
    // Start at the last page if history exists, otherwise 0
    const [page, setPage] = useState(storyHistory.length > 0 ? storyHistory.length - 1 : 0);

    const hasHistory = storyHistory.length > 0;

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < storyHistory.length - 1) setPage(page + 1);
    };

    // Ensure we handle both legacy string format and new object format explicitly
    const currentItem = hasHistory ? storyHistory[page] : null;
    
    let displayWeek = 1;
    let displayContent = "";

    if (currentItem) {
        if (typeof currentItem === 'string') {
             displayWeek = page + 1;
             displayContent = currentItem;
        } else {
             displayWeek = currentItem.week;
             
             // Check if content is an object (GenderText) and resolve it
             const rawContent = currentItem.content;
             if (typeof rawContent === 'object' && rawContent !== null) {
                 const c = rawContent as any;
                 if (gender === 'male' && c.male) displayContent = c.male;
                 else if (gender === 'female' && c.female) displayContent = c.female;
                 else displayContent = c.neutral || c.male || "";
             } else {
                 displayContent = rawContent;
             }
        }
    }

    return (
      <ModalOverlay onClose={onClose}>
        <div className="nes-container is-dark with-title w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <p className="title">聯絡簿</p>
          
          <div className="mb-4 text-center">
             <a 
                href={NOVEL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                    try {
                        (window as any).dataLayer = (window as any).dataLayer || [];
                        (window as any).dataLayer.push({ event: 'NovelClick', location: 'Desk' });
                    } catch(e) {}
                }}
                className="text-xs text-blue-400 hover:text-blue-300 border-b border-blue-400 pb-0.5 inline-block transition-colors cursor-pointer"
                style={{ touchAction: 'auto' }}
                onPointerDown={(e) => e.stopPropagation()}
             >
                完成的故事都在《台孩危機》
             </a>
          </div>
          
          {!hasHistory ? (
              // Empty State / Initial Flavor Text
              <div className="flex gap-4 items-start">
                <i className="nes-icon heart is-empty is-medium"></i>
                <div>
                  <p>為什麼要上學？</p>
                  <p className="mt-4 mb-4 text-sm">為什麼<br/><span className="nes-text is-error">不能一起跟國小同學上國中</span><br/>？</p>
                  <p className="nes-text is-disabled text-xs">這裡到底是哪裡。</p>
                </div>
              </div>
          ) : (
              // Paginated Story Content
              <div className="flex flex-col h-full min-h-[300px]">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                       <span className="text-yellow-400 text-xs">第 {displayWeek} 週</span>
                       <span className="text-gray-500 text-xs">{page + 1} / {storyHistory.length}</span>
                  </div>
                  
                  <div className="flex-1 bg-black/20 p-4 rounded mb-4 overflow-y-auto">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                          {displayContent}
                      </p>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                      <button 
                          className={`nes-btn is-small ${page === 0 ? 'is-disabled' : ''}`} 
                          onClick={handlePrev}
                          disabled={page === 0}
                      >
                          <ChevronLeft size={16} />
                      </button>
                      
                      <button type="button" className="nes-btn" onClick={onClose}>
                          關閉
                      </button>
                      
                      <button 
                          className={`nes-btn is-small ${page === storyHistory.length - 1 ? 'is-disabled' : ''}`} 
                          onClick={handleNext}
                          disabled={page === storyHistory.length - 1}
                      >
                          <ChevronRight size={16} />
                      </button>
                  </div>
              </div>
          )}

          {!hasHistory && (
              <div className="mt-4 text-right">
                <button type="button" className="nes-btn" onClick={onClose}>結束</button>
              </div>
          )}
        </div>
      </ModalOverlay>
    );
};

export default DeskModal;
