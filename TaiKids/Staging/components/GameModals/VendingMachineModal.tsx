
import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import { ASSET_VERSION } from '../../game/constants';

export interface VendingItem {
    id: number;
    name: string;
    price: number;
    hungriness: number;
    tValue: number;
}

export const VENDING_ITEMS: VendingItem[] = [
    {id: 1, name: "小豬蘑菇方便麵", price: 6, hungriness: 15, tValue: -8},
    {id: 2, name: "泡椒鳳爪", price: 2, hungriness: 4, tValue: -12},
    {id: 3, name: "魔芋爽", price: 2, hungriness: 6, tValue: -16},
    {id: 4, name: "螺獅粉", price: 4, hungriness: 4, tValue: -12},
    {id: 5, name: "綠舌頭冰棒", price: 1, hungriness: 3, tValue: -12},
    {id: 6, name: "康老師冰紅茶", price: 1, hungriness: 2, tValue: -4},
    {id: 7, name: "來乙客京燉風味泡麵", price: 15, hungriness: 15, tValue: 6},
    {id: 8, name: "七囍汽水", price: 1, hungriness: 2, tValue: 0},
    {id: 9, name: "辛拉麵", price: 10, hungriness: 15, tValue: 0},
    {id: 10, name: "黑松沙士", price: 4, hungriness: 2, tValue: 4},
];

interface VendingMachineProps {
    onClose: () => void;
    currentMoney: number;
    onBuy: (items: VendingItem[]) => void;
}

const VendingMachineModal = ({ onClose, currentMoney, onBuy }: VendingMachineProps) => {
    // State to track quantity of each item: { [itemId]: quantity }
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const newCount = Math.max(0, current + delta);
            
            const newState = { ...prev };
            if (newCount === 0) {
                delete newState[id];
            } else {
                newState[id] = newCount;
            }
            return newState;
        });
    };

    // Flatten quantities into a list of items for the onBuy callback
    const getSelectedItems = () => {
        const items: VendingItem[] = [];
        Object.entries(quantities).forEach(([idStr, qty]) => {
             const item = VENDING_ITEMS.find(i => i.id === Number(idStr));
             if (item) {
                 for(let i = 0; i < (qty as number); i++) {
                     items.push(item);
                 }
             }
        });
        return items;
    };

    const selectedItems = getSelectedItems();
    const totalCost = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const totalCount = selectedItems.length;

    const canAfford = currentMoney >= totalCost;
    
    const handleCheckout = () => {
        if (!canAfford || totalCount === 0) return;
        onClose();
        onBuy(selectedItems);
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="nes-container is-dark with-title w-full max-w-lg h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <p className="title">自宅福利社販賣機</p>
                
                <div className="flex justify-between items-end mb-2 px-2">
                    <p className="text-xs text-gray-400">點擊選取 (按紅標取消)</p>
                    <p className="text-xs text-yellow-400">零用錢 {currentMoney} 羊</p>
                </div>

                <div className="flex-1 overflow-y-auto p-1 grid grid-cols-2 gap-3 min-h-0">
                    {VENDING_ITEMS.map(item => {
                        const count = quantities[item.id] || 0;
                        const isSelected = count > 0;
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => updateQuantity(item.id, 1)}
                                className={`
                                    nes-container is-rounded p-2 flex flex-col items-center relative cursor-pointer transition-all duration-200
                                    ${isSelected ? 'is-primary bg-gray-800 border-white' : 'is-dark border-gray-600 opacity-80 hover:opacity-100'}
                                `}
                            >
                                {isSelected && (
                                    <div 
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow border border-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateQuantity(item.id, -1);
                                        }}
                                    >
                                        <span className="text-xs font-bold font-sans">{count}</span>
                                    </div>
                                )}
                                
                                <img 
                                    src={`https://t.oby.tw/static/assets/vending-machine/icon_${item.id}.png?version=${ASSET_VERSION}`} 
                                    alt={item.name} 
                                    className={`w-12 h-12 mb-2 transition-transform ${isSelected ? 'scale-110' : ''}`}
                                    style={{imageRendering: 'pixelated'}}
                                />
                                <p className="text-xs text-center h-8 flex items-center justify-center leading-tight mb-2 w-full line-clamp-2">
                                    {item.name}
                                </p>
                                <div className="text-xs mt-auto">
                                    {item.price} 羊
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm px-2">
                        <span>總金額</span>
                        <span className={`${canAfford ? 'text-green-400' : 'text-red-500'}`}>{totalCost} 羊</span>
                    </div>
                    
                    <button 
                        type="button" 
                        className={`nes-btn w-full ${canAfford && totalCount > 0 ? 'is-success' : 'is-disabled'}`}
                        disabled={!canAfford || totalCount === 0}
                        onClick={handleCheckout}
                    >
                        {totalCount === 0 ? '請選擇商品' : (!canAfford ? '餘額不足' : `購買 (${totalCount})`)}
                    </button>
                    
                    <button className="nes-btn is-error w-full" onClick={onClose}>離開</button>
                </div>
            </div>
        </ModalOverlay>
    );
};

export default VendingMachineModal;
