import React from 'react';

interface WarrantyBadgeProps {
  warranty: boolean;
  className?: string;
}

const WarrantyBadge: React.FC<WarrantyBadgeProps> = ({ warranty, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      warranty 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-gray-100 text-gray-800'
    } ${className}`}>
      {warranty ? 'Con Garantía' : 'Sin Garantía'}
    </span>
  );
};

export default WarrantyBadge;