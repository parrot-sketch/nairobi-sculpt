import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-400',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 disabled:bg-neutral-400',
    danger: 'bg-accent-500 text-white hover:bg-accent-600 disabled:bg-neutral-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  label,
}: InputProps) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition disabled:bg-neutral-100"
      />
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-neutral-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>{children}</div>
);
