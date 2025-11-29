import React from 'react';
import SharedInstructionDialog from '../../components/SharedInstructionDialog';

interface Props {
  onStart: () => void;
}

const InstructionDialog: React.FC<Props> = ({ onStart }) => {
  return (
    <SharedInstructionDialog 
      title="任務說明" 
      buttonText="開始寫作" 
      onStart={onStart}
    >
      <p>
        語文課上，老師要你以<span className="text-blue-800 font-bold mx-1">我的夢想</span>為題寫作文。
      </p>
      <ul className="list-disc list-inside space-y-2 text-xl bg-white/50 p-4 rounded-lg">
        <li>從下方字詞卡拖曳到作文用紙上。</li>
        <li>記得<span className="font-bold text-red-700">寫標題</span>！</li>
        <li><span className="text-blue-700">藍色字卡</span>放在第一行。</li>
        <li><span className="text-emerald-700">綠色字卡</span>放在綠色格線內。</li>
      </ul>
      <p>完成後點選「交給老師批改」。</p>
    </SharedInstructionDialog>
  );
};

export default InstructionDialog;