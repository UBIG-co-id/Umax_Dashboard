import React, { useState } from 'react';
import { AiOutlineInfoCircle, AiOutlineClose } from 'react-icons/ai';
import { CSSTransition } from 'react-transition-group';
import '../styles.css';

export default function CardInfo({ title, value, color = "text-gray-500", popupContent, className = "" }) {
    const [activePopup, setActivePopup] = useState(false);

    const openPopup = () => {
        setActivePopup(true);
    };

    const closePopup = () => {
        setActivePopup(false);
    };

    return (
        <div className={`p-4 relative rounded-lg bg-slate-100 border border-gray-300 ${className}`}>
            <div className='flex justify-between items-center'>
                <div className='text-sm font-medium text-gray-500'>{title}</div>
                <div className='text-gray-500'>
                    <AiOutlineInfoCircle size={20} onClick={openPopup} />
                </div>
            </div>
            <div className={`${color} text-xl font-bold`}>{value}</div>

            <CSSTransition
                in={activePopup}
                timeout={300}
                classNames="popup"
                unmountOnExit
            >
                <div className="popup-content">
                    <div className="close-button" onClick={closePopup}>
                        <AiOutlineClose size={15} />
                    </div>
                    {popupContent}
                    Amount Spent ialah pengeluaran
                </div>
            </CSSTransition>
        </div>
    );
}
