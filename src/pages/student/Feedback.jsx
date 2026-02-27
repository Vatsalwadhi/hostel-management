import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitFeedback } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { HiStar } from 'react-icons/hi2';

/**
 * Feedback page – interactive star rating + comment.
 */
const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setToast('Please select a rating.');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({
        studentId: user.id,
        studentName: user.name,
        rating,
        comment,
      });
      setToast('Feedback submitted successfully! Thank you.');
      setRating(0);
      setComment('');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Submit Feedback
      </h1>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            toast.startsWith('Error') || toast.startsWith('Please')
              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {toast}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          {/* Star rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate your experience
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform duration-150 hover:scale-110"
                >
                  <HiStar
                    className={`h-10 w-10 ${
                      star <= (hover || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    } transition-colors duration-150`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your thoughts about the maintenance service..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : 'Submit Feedback'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Feedback;
