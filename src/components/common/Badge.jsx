/**
 * Reusable Badge component for status / priority labels.
 */
const colorMap = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  Medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const Badge = ({ text, className = '' }) => {
  const color = colorMap[text] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`
        inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${color} ${className}
      `}
    >
      {text}
    </span>
  );
};

export default Badge;
