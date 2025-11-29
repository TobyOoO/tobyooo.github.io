
import React from 'react';
import ModalOverlay from './ModalOverlay';
import { LessonResult } from '../../Lessons/PixelEssayGame/types';
import { NOVEL_LINK } from '../../game/constants';

interface Props {
  onClose: () => void;
  academicHistory?: LessonResult[];
}

const BookShelfModal: React.FC<Props> = ({ onClose, academicHistory = [] }) => (
  <ModalOverlay onClose={onClose}>
    <div className="nes-container is-dark with-title w-full max-w-md" onClick={(e) => e.stopPropagation()}>
      <p className="title">學業成績</p>
      
      <div className="mb-4 text-center">
         <a 
            href={NOVEL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
                try {
                    (window as any).dataLayer = (window as any).dataLayer || [];
                    (window as any).dataLayer.push({ event: 'NovelClick', location: 'BookShelf' });
                } catch(e) {}
            }}
            className="text-xs text-yellow-400 hover:text-yellow-300 border-b border-yellow-400 pb-0.5 inline-block transition-colors cursor-pointer"
            style={{ touchAction: 'auto' }}
            onPointerDown={(e) => e.stopPropagation()}
         >
            需要攻略密集？快去看《台孩危機》
         </a>
      </div>

      <div className="nes-table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="nes-table is-bordered is-centered is-dark w-full">
          <thead>
            <tr>
              <th className="text-xs">週次</th>
              <th className="text-xs">課堂名稱</th>
              <th className="text-xs">得分</th>
              <th className="text-xs">評語</th>
            </tr>
          </thead>
          <tbody>
            {academicHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500">尚無成績記錄</td>
              </tr>
            ) : (
              academicHistory.map((record, index) => (
                <tr key={index}>
                  <td className="text-xs">第 {record.week || index + 1} 週</td>
                  <td className="text-xs">{record.name}</td>
                  <td className="text-xs">
                    <span className={record.score >= 60 ? 'nes-text is-success' : 'nes-text is-error'}>
                      {record.score}
                    </span>
                  </td>
                  <td className="text-[10px] text-left align-top leading-tight" style={{minWidth: '150px'}}>
                    {record.lessonComment}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <button type="button" className="nes-btn is-error" onClick={onClose}>關閉</button>
      </div>
    </div>
  </ModalOverlay>
);

export default BookShelfModal;
