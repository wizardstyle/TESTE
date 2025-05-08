import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', footer }) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;