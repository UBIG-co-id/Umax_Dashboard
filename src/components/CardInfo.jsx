import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { CSSTransition } from 'react-transition-group';
import '../styles.css';
import { silang } from "../assets";

export default function CardInfo({ title, value, color, popupContent}) {
    const [activePopup, setActivePopup] = useState(false);
    const popupRef = useRef(null);

    const openPopup = () => {
        setActivePopup(true);   
    };

    const closePopup = () => {
        setActivePopup(false);
    };

    // Tambahkan event listener untuk menutup popup content saat mengklik di luarnya
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup();
            }
        }
    
        function handleEscapeKey(event) {
            if (event.key === "Escape") {
                closePopup();
            }
        }
    
        if (activePopup) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [activePopup]);
    
    const renderColor = (colorFromSwagger) => {
        switch (colorFromSwagger) {
            case 'Danger':
                return { bgColor: 'text-red-500 bg-red-100', border: 'border border-red-500' };
            case 'Warning':
                return { bgColor: 'text-yellow-500 bg-yellow-100', border: 'border border-yellow-500'};
            case 'Success':
                return { bgColor: ' text-green-500 bg-green-100', border: 'border border-green-500'};
            default:
                return { bgColor: 'bg-sky-100', border: 'border border-sky-500'};
        }
    };

    const { bgColor, border } = renderColor(color);
   

    return (
        <div className={`p-4 relative rounded-lg bg-slate-100 border border-gray-300  ${bgColor} ${border} ${color}`}>
            <div className='flex justify-between items-center'>
                <div className={`text-sm font-medium ${color}`}>{title}</div>
                <div className='text-gray-500 cursor-pointer'>
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

                
                <div className='popup-content ' ref={popupRef} >
                    <div className='flex justify-between items-center bg-blue-500 text-white p-3 rounded-t-lg'>
                        <div className='text-md font-semibold'>{title}</div>
                        <div
                            className="close-button bg-gray-300 hover:bg-slate-100  rounded-full text-white"
                            onClick={closePopup}
                        >
                            <img
                                src={silang}
                                alt="Close"
                                width={16}
                                style={{ cursor: "pointer" }}
                                onClick={closePopup} 
                            />
                        </div>
                    </div>
                    {activePopup && (
                        <div className='popup-body' style={{ overflowY: 'auto', maxHeight: '100px' }}>
                        <div className='-mt-1 p-3' title={popupContent}>
                            {popupContent}
                        </div>
                    </div>
                    )}
                </div>
            </CSSTransition>
        </div>
    );
}
