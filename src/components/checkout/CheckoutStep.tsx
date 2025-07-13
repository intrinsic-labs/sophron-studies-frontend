import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface CheckoutStepProps {
  step: number;
  title: string;
  isActive: boolean;
  isComplete: boolean;
}

const CheckoutStep: React.FC<CheckoutStepProps> = ({ step, title, isActive, isComplete }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
        ${isComplete 
          ? 'bg-green-500 text-white' 
          : isActive 
            ? 'bg-black text-white' 
            : 'bg-gray-200 text-gray-600'
        }
      `}>
        {isComplete ? <FiCheck size={16} /> : step}
      </div>
      <span className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
};

export default CheckoutStep; 