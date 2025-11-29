
import React, { useEffect, useState } from 'react';
import stateManager, { GameFlow } from '../game/managers/StateManager';
import { getEndingStory } from '../game/data/endingData';
import StoryDialog from '../components/GameModals/StoryDialog';
import NamePicker, { Gender } from '../components/GameModals/NamePicker';
import { ASSET_VERSION } from '../game/constants';

interface Props {
    endingData: {
        id: string;
        tValue: number;
        academicScore: number;
        closeness: number;
        week: number;
        academicRanking: string;
    };
}

const EndingTellingStage: React.FC<Props> = ({ endingData }) => {
    const story = getEndingStory(endingData.id);
    
    // Phases: init (black), image, text, exit
    const [phase, setPhase] = useState<'init' | 'image' | 'text' | 'exit'>('init');
    
    // Verification state
    const [verifying, setVerifying] = useState(false);
    const [failed, setFailed] = useState(false);
    
    const [savedData] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('pixel-room-save') || '{}');
        } catch(e) { return {}; }
    });

    const startStorySequence = () => {
        setPhase('init');
        setTimeout(() => setPhase('image'), 1000); // Fade in image after 1s
        setTimeout(() => setPhase('text'), 3000);  // Show text after another 2s
    };
    
    const trackUnlock = () => {
        try {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
                event: 'EndingUnlocked',
                endingId: endingData.id,
                closeness: endingData.closeness,
                tValue: endingData.tValue,
                academicRank: endingData.academicRanking
            });
        } catch(e) {}
    };

    useEffect(() => {
        if (!story) return;

        // If story requires name verification, start verification flow first
        if (story.requireName) {
            setVerifying(true);
        } else {
            // Unlock immediately if no name required
            window.dispatchEvent(new CustomEvent('cmd-unlock-ending', { detail: endingData }));
            trackUnlock();
            startStorySequence();
        }
    }, [story, endingData]);

    const handleCloseStory = () => {
        finishStage(true);
    };

    // Verification Handlers
    const handleNameCheck = (enteredName: string) => {
        const savedName = savedData.persona?.name || '';
        if (enteredName === savedName) {
            setVerifying(false);
            // Unlock history only on success
            window.dispatchEvent(new CustomEvent('cmd-unlock-ending', { detail: endingData }));
            trackUnlock();
            startStorySequence();
        } else {
            setVerifying(false);
            setFailed(true);
        }
    };
    
    const handleNameCancel = () => {
        setVerifying(false);
        setFailed(true);
    };

    const handleFailDialogClose = () => {
        finishStage(false);
    };
    
    const finishStage = (success: boolean) => {
        // Determine if this ending is new by checking against saved history (loaded on mount)
        // Since PlayerStats updates are in-memory until StateUpdate (which happens after this stage), 
        // savedData reflects state BEFORE this ending was unlocked.
        const isNewUnlock = !savedData.endingHistory?.some((h: any) => h.id === endingData.id);

        setPhase('exit');
        // Wait for fade out animation before switching state
        setTimeout(() => {
            stateManager.setState(GameFlow.State.InRoom);
            window.dispatchEvent(new CustomEvent('cmd-ending-feedback', { detail: { success, isNew: isNewUnlock } }));
            // Auto-save the game progress (including the newly unlocked ending)
            window.dispatchEvent(new CustomEvent('cmd-save-game'));
        }, 1500);
    };

    if (!story) return null;

    return (
        <div className={`fixed inset-0 z-[300] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Ending Image - Only show if verified/no-verify AND not failed */}
            {!failed && !verifying && (
                <div 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-2000 ease-in-out ${phase === 'init' ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                        backgroundImage: `url(https://t.oby.tw/static/assets/endings/${endingData.id}-min.png?version=${ASSET_VERSION})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}

            {/* Story Dialog */}
            {phase === 'text' && !failed && !verifying && (
                <StoryDialog 
                    content={
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-yellow-500 font-bold border-b border-gray-600 pb-2">
                                {story.title}
                            </h3>
                            <div 
                                className="text-base leading-relaxed text-gray-200"
                                dangerouslySetInnerHTML={{ __html: story.content }} 
                            />
                        </div>
                    } 
                    onClose={handleCloseStory} 
                />
            )}
            
            {/* Name Verification Picker */}
            {verifying && (
                <NamePicker 
                    gender={(savedData.persona?.gender as Gender) || 'male'}
                    onConfirm={handleNameCheck}
                    onCancel={handleNameCancel}
                    title="身份核實"
                    description="為了更好的訂票服務，請核實貴賓您的姓名"
                    showCancel={true}
                />
            )}
            
            {/* Verification Fail Dialog */}
            {failed && (
                <StoryDialog 
                    content="你的身份被公安懷疑。你爸媽透過關係把你弄回房間。"
                    onClose={handleFailDialogClose}
                />
            )}
        </div>
    );
};

export default EndingTellingStage;
