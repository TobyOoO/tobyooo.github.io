
import React from 'react';
import SharedInstructionDialog from '../../components/SharedInstructionDialog';

interface Props {
  onStart: () => void;
}

const InstructionDialog: React.FC<Props> = ({ onStart }) => {
  return (
    <SharedInstructionDialog 
      title="作文練習" 
      buttonText="開始寫作" 
      onStart={onStart}
    >
      <p>
        這是你在台灣學校的作文課。請注意這裡的書寫格式是<span className="text-blue-800 font-bold mx-1">直書</span>（由上到下，由右到左）。
      </p>
      <ul className="list-disc list-inside space-y-2 text-xl bg-white/50 p-4 rounded-lg">
        <li>從下方字詞卡拖曳到作文用紙上。</li>
        <li>最右邊一行是<span className="text-blue-700 font-bold">標題區</span>。</li>
        <li>標題上方必須<span className="font-bold text-red-700">空四格</span>。</li>
        <li>內文段落開頭要<span className="font-bold text-emerald-700">空兩格</span>。</li>
      </ul>
      <p>完成後點選「交給老師批改」。</p>
    </SharedInstructionDialog>
  );
};

export default InstructionDialog;
