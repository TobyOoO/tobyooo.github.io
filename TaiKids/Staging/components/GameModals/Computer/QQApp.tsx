
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QQ_CHATS, ChatScenario, GenderText } from '../../../game/data/computerData';
import { QQAppProps } from './types';

const QQApp: React.FC<QQAppProps> = ({ currentWeek, gender, onCloseApp, chatHistory, onChatReply }) => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    // --- Helper to resolve text based on gender ---
    const getText = (content: GenderText): string => {
        if (typeof content === 'string') return content;
        // Fallback: If gender matches key, use it. Else 'neutral' or 'male'.
        if (gender === 'male' && content.male) return content.male;
        if (gender === 'female' && content.female) return content.female;
        if (content.neutral) return content.neutral;
        return content.male || "Unknown";
    };

    // --- Determine available chats & sort ---
    let displayChats: ChatScenario[] = [];

    if (currentWeek >= 13) {
        // Free Mode: Random chat
        const randomIndex = currentWeek % QQ_CHATS.length;
        displayChats = [QQ_CHATS[randomIndex]];
    } else {
        // Standard Mode
        // 1. Filter: Week Requirement Met
        const unlockedChats = QQ_CHATS.filter(c => c.weekRequirement <= currentWeek);
        
        // 2. Separate into Active (Unread) and Completed
        const activeChats = unlockedChats.filter(c => !chatHistory[c.id]);
        const completedChats = unlockedChats.filter(c => !!chatHistory[c.id]);

        // 3. Combine: Active first, then Completed
        // (Optional: Sort completed by week requirement or ID)
        displayChats = [...activeChats, ...completedChats];
    }

    const selectedScenario = QQ_CHATS.find(c => c.id === selectedChatId);

    const handleReply = (scenario: ChatScenario, replyIndex: number) => {
        const reply = scenario.replies[replyIndex];
        onChatReply(scenario.id, replyIndex, reply.closenessImpact);
        
        // Auto scroll
        setTimeout(() => {
            const chatBody = document.getElementById('qq-chat-body');
            if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
        }, 100);
    };

    return (
        <div className="flex flex-col h-full">
            {/* QQ Header / Nav */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-4 border-gray-200">
                <button className="nes-btn is-error px-2 py-0" onClick={() => {
                    if (selectedChatId) setSelectedChatId(null);
                    else onCloseApp();
                }}>
                   <ArrowLeft size={16} />
                </button>
                <span className="text-sm font-bold text-gray-600">
                    {selectedChatId ? '聊天室' : '好友列表'}
                </span>
            </div>

            {/* QQ Content */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-white border-4 border-gray-300 p-2 rounded">
                 {!selectedChatId ? (
                     <div className="overflow-y-auto h-full space-y-2">
                         <div className="bg-blue-100 p-2 border-b-2 border-blue-200 text-black text-xs font-bold flex justify-between">
                            <span>我的朋友</span>
                            <span>({displayChats.length})</span>
                         </div>
                         {displayChats.length === 0 && (
                             <div className="text-center text-gray-400 mt-10 text-xs">沒有朋友在線上。</div>
                         )}
                         {displayChats.map(chat => {
                             const isDone = !!chatHistory[chat.id];
                             return (
                                 <div 
                                     key={chat.id}
                                     onClick={() => setSelectedChatId(chat.id)}
                                     className={`
                                        flex items-center gap-3 p-2 cursor-pointer border-b border-gray-100 transition-colors
                                        ${isDone ? 'bg-gray-50 hover:bg-gray-100 opacity-70' : 'bg-white hover:bg-blue-50'}
                                     `}
                                 >
                                     <div className="relative">
                                        {/* Icon changes if new message available vs read */}
                                        <i className={`nes-icon is-small ${isDone ? 'like' : 'twitter'}`}></i>
                                        {!isDone && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                        )}
                                     </div>
                                     <div className="flex flex-col flex-1">
                                         <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-black">瑞翔 (Ray)</span>
                                            {isDone && <span className="text-[10px] text-green-600 bg-green-100 px-1 rounded">已讀</span>}
                                            {!isDone && <span className="text-[10px] text-red-600 bg-red-100 px-1 rounded font-bold">新訊息</span>}
                                         </div>
                                         <span className="text-[10px] text-gray-500 truncate">{chat.title}</span>
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 ) : (
                     <div className="flex flex-col h-full">
                         <div className="bg-blue-500 text-white text-xs p-1 mb-2 flex items-center justify-between">
                             <span>To: 瑞翔</span>
                             <button className="text-white underline" onClick={() => setSelectedChatId(null)}>返回</button>
                         </div>

                         <div id="qq-chat-body" className="flex-1 overflow-y-auto space-y-4 p-2">
                             {/* Scenario Messages */}
                             {selectedScenario && selectedScenario.messages.map((msg, idx) => (
                                 <div key={idx} className="flex gap-2 items-end">
                                     <i className="nes-icon twitter is-small"></i>
                                     <div className="nes-balloon from-left is-small p-2">
                                         <p className="text-xs text-black m-0">{getText(msg)}</p>
                                     </div>
                                 </div>
                             ))}

                             {/* User Reply / Choice */}
                             {selectedScenario && chatHistory[selectedScenario.id] ? (
                                 <>
                                     <div className="flex gap-2 items-end justify-end">
                                         <div className="nes-balloon from-right is-dark is-small p-2">
                                             <p className="text-xs text-white m-0">
                                                 {getText(selectedScenario.replies[chatHistory[selectedScenario.id].choiceIndex].text)}
                                             </p>
                                         </div>
                                         <i className="nes-icon twitch is-small"></i>
                                     </div>
                                     
                                     {/* Final Response */}
                                     <div className="flex gap-2 items-end">
                                         <i className="nes-icon twitter is-small"></i>
                                         <div className="nes-balloon from-left is-small p-2">
                                             <p className="text-xs text-black m-0">
                                                 {getText(selectedScenario.replies[chatHistory[selectedScenario.id].choiceIndex].response)}
                                             </p>
                                         </div>
                                     </div>
                                 </>
                             ) : selectedScenario && (
                                 <div className="mt-4 p-2 bg-gray-100 border-t-2 border-gray-300">
                                     <p className="text-xs text-gray-500 mb-2">回覆：</p>
                                     <div className="flex flex-col gap-2">
                                         {selectedScenario.replies.map((reply, idx) => (
                                             <button 
                                                 key={idx}
                                                 onClick={() => handleReply(selectedScenario, idx)}
                                                 className="nes-btn is-normal is-small text-left"
                                             >
                                                 {getText(reply.text)}
                                             </button>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default QQApp;
