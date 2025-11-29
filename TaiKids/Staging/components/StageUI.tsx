
import React from 'react';

export const StageTitle: React.FC<{ title: string }> = ({ title }) => (
    <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <h1 className="text-2xl text-white" style={{ fontFamily: '"Press Start 2P"' }}>{title}</h1>
    </div>
);

export const StageInstructions: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-20 px-4">
        <div className="inline-block nes-container is-dark is-rounded py-2 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <p className="text-xs text-white">
                {text}
            </p>
        </div>
    </div>
);
