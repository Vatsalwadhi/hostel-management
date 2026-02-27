/**
 * Reusable Card component with optional title.
 */
const Card = ({ children, title, className = '' }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-sm
        border border-gray-100 dark:border-gray-700
        p-5 transition-all duration-200
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
