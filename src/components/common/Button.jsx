/**
 * Reusable Button component with variants.
 * Variants: primary (default), secondary, danger
 */
const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-300',
  secondary:
    'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white focus:ring-gray-300',
  danger:
    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
  success:
    'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
