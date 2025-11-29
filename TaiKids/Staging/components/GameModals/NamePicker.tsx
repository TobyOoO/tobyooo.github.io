
import React, { useState } from 'react';
import { NAME_DATA } from '../../game/data/nameData';

export type Gender = 'male' | 'female' | 'neutral';

interface Props {
    gender: Gender;
    onConfirm: (fullName: string) => void;
    onCancel?: () => void;
    title?: string;
    description?: string;
    showCancel?: boolean;
}

const NamePicker: React.FC<Props> = ({ gender, onConfirm, onCancel, title = "你是誰", description, showCancel = false }) => {
  const [surname, setSurname] = useState<string | null>(null);
  const [givenName, setGivenName] = useState<string[]>([]);

  const handleSurnameSelect = (char: string) => setSurname(char);

  const handleGivenNameSelect = (char: string) => {
      if (givenName.length < 2) {
          setGivenName([...givenName, char]);
      }
  };

  const handleBackspace = () => {
      if (givenName.length > 0) {
          setGivenName(givenName.slice(0, -1));
      } else if (surname) {
          setSurname(null);
      }
  };

  const handleComplete = () => {
      if (surname) {
          onConfirm(surname + givenName.join(''));
      }
  };
  
  const getGivenNamePool = () => {
      if (gender === 'female') return NAME_DATA.female_given_name_characters;
      if (gender === 'male') return NAME_DATA.male_given_name_characters;
      return NAME_DATA.gender_neutral_characters;
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4" onClick={e => e.stopPropagation()}>
        <div className="w-full max-w-lg nes-container is-dark with-title animate-in fade-in">
            <p className="title">{title}</p>
            
            {description && (
                <p className="text-sm text-gray-300 mb-4 text-center px-4">{description}</p>
            )}
            
            <div className="bg-gray-800 p-4 mb-6 text-center rounded border-2 border-gray-600 min-h-[80px] flex items-center justify-center gap-2">
                {surname ? (
                    <span className="text-4xl text-white border-b-2 border-white pb-1 handwriting-font">{surname}</span>
                ) : (
                    <span className="text-4xl text-gray-600 border-b-2 border-gray-600 pb-1 w-10 h-10 inline-block"></span>
                )}
                
                {givenName.map((char, i) => (
                    <span key={i} className="text-4xl text-white border-b-2 border-white pb-1 handwriting-font">{char}</span>
                ))}
                
                {givenName.length < 2 && (
                    <span className="text-4xl text-gray-600 border-b-2 border-gray-600 pb-1 w-10 h-10 inline-block animate-pulse"></span>
                )}
            </div>

            {!surname ? (
                <div>
                    <p className="text-xs text-gray-400 mb-2 text-center">告訴我你的姓</p>
                    <div className="grid grid-cols-5 gap-2">
                        {NAME_DATA.surnames.map(char => (
                            <button 
                                key={char}
                                onClick={() => handleSurnameSelect(char)}
                                className="nes-btn is-primary px-0 py-2 text-xl"
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-xs text-gray-400 mb-2 text-center">告訴我你的名 ({givenName.length}/2)</p>
                    <div className="grid grid-cols-5 gap-2">
                        {getGivenNamePool().map(char => (
                            <button 
                                key={char}
                                onClick={() => handleGivenNameSelect(char)}
                                disabled={givenName.length >= 2}
                                className={`nes-btn px-0 py-2 text-xl ${givenName.length >= 2 ? 'is-disabled' : 'is-success'}`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-between">
                <button onClick={handleBackspace} className="nes-btn is-error">
                    刪除
                </button>
                
                <div className="flex gap-2">
                    {showCancel && onCancel && (
                         <button onClick={onCancel} className="nes-btn">放棄</button>
                    )}
                    <button 
                        onClick={handleComplete} 
                        disabled={!surname || givenName.length === 0}
                        className={`nes-btn ${(!surname || givenName.length === 0) ? 'is-disabled' : 'is-primary'}`}
                    >
                        確定
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default NamePicker;
