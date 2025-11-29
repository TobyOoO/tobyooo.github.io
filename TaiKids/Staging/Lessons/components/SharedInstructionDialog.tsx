import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  buttonText: string;
  onStart: () => void;
}

const SharedInstructionDialog: React.FC<Props> = ({ title, children, buttonText, onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pixel-font">
      <div className="bg-[#f4e4bc] p-6 sm:p-8 rounded shadow-2xl max-w-lg w-full border-8 border-[#8b5e3c] relative animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#d93025] text-white px-6 py-2 rounded font-bold tracking-widest shadow-md whitespace-nowrap">
          {title}
        </div>
        <div className="handwriting-font text-2xl text-[#4a3b2a] space-y-6 mt-4 leading-relaxed text-justify">
          {children}
        </div>
        <button 
          onClick={onStart}
          className="w-full mt-8 bg-[#8b5e3c] text-[#f4e4bc] text-2xl py-3 rounded font-bold hover:bg-[#6b4830] active:translate-y-1 transition-all shadow-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SharedInstructionDialog;