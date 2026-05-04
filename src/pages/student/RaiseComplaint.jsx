import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createComplaint } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Spinner from '../../components/common/Spinner';
import { HiOutlineCloudArrowUp, HiOutlineXMark } from 'react-icons/hi2';

const categories = ['Electrical', 'Plumbing', 'WiFi', 'Furniture', 'Sanitation', 'Other'];

/**
 * Raise Complaint page – form with category, description, image upload.
 */
const RaiseComplaint = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ category: '', description: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  /**
   * Compress and convert image to base64 for storage.
   * Max dimension: 800px. Quality: 0.7. This keeps it under ~100KB.
   */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB raw)
    if (file.size > 5 * 1024 * 1024) {
      setToast('Error: Image must be less than 5MB.');
      setTimeout(() => setToast(''), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Compress using canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = (height / width) * MAX_DIM;
            width = MAX_DIM;
          } else {
            width = (width / height) * MAX_DIM;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setImagePreview(compressed);
        setImageBase64(compressed);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.category) errs.category = 'Please select a category.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await createComplaint({
        studentId: user.id,
        studentName: user.name,
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        category: form.category,
        description: form.description,
        image: imageBase64,
      });
      setToast('Complaint submitted successfully!');
      setForm({ category: '', description: '' });
      removeImage();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Raise a Complaint
      </h1>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            toast.startsWith('Error')
              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {toast}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your issue in detail..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Image upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attach Image (optional)
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors">
                <HiOutlineCloudArrowUp className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload an image
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  PNG, JPG up to 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                  <HiOutlineXMark className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : 'Submit Complaint'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RaiseComplaint;
