import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
  text?: string;
}

const HintBanner: React.FC<Props> = ({ 
  visible, 
  onClose,
  text = "瑞翔好像在一本叫《台孩危機》的小說，其中一篇〈敏捷開發〉留了些線索。要去找來看嗎？"
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-2 left-2 right-2 z-40 animate-in slide-in-from-top-2 duration-300 font-sans pointer-events-auto">
      <div className="bg-black/90 text-white p-3 rounded-lg shadow-2xl border-l-4 border-yellow-500 flex items-start gap-3 relative max-w-[600px] mx-auto">
        <Lightbulb className="text-yellow-500 shrink-0 mt-1" size={20} />
        <div className="flex-1 mr-6">
          <h4 className="font-bold text-yellow-500 text-sm mb-1">小提示</h4>
          <p className="text-sm leading-relaxed text-gray-200">
            {text}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default HintBanner;