// card.jsx
import { AiOutlineCloseCircle, AiOutlineWarning } from 'react-icons/ai';
import { FaRegCheckCircle } from 'react-icons/fa';

export default function Card({ color, children }) {
    const renderColor = (colorFromSwagger) => {
        switch (colorFromSwagger) {
            case 'Danger':
                return { bgColor: 'bg-red-100', border: 'border border-red-500', icon: <AiOutlineCloseCircle size={25} className="text-red-500" /> };
            case 'Warning':
                return { bgColor: 'bg-yellow-100', border: 'border border-yellow-500', icon: <AiOutlineWarning size={25} className="text-yellow-500" /> };
            case 'Success':
                return { bgColor: 'bg-green-100', border: 'border border-green-500', icon: <FaRegCheckCircle size={25} className="text-green-500" /> };
            default:
                return { bgColor: 'bg-sky-100', border: 'border border-sky-500', icon: null };
        }
    };

   

    const { bgColor, border, icon } = renderColor(color);

    return (
        <div className={`${bgColor} ${border}rounded-lg p-4`} >
            {icon && (
                <div className="flex items-start rounded-lg">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="flex flex-col gap-2">{children}</div>
                </div>
            )}
        </div>
    );
}
