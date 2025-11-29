
import React from 'react';

const StoryDialog = ({ content, onClose }: { content: React.ReactNode, onClose: () => void }) => (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="nes-container is-dark is-rounded with-title">
            <p className="title">謎之聲</p>
            <div className="whitespace-pre-line leading-loose text-sm sm:text-base">{content}</div>
            <div className="text-right mt-2">
                <button className="nes-btn is-primary is-small" onClick={onClose}>
                    繼續
                </button>
            </div>
        </div>
    </div>
);

export default StoryDialog;
