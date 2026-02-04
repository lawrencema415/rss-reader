import { useEffect, useState } from 'react';
import { Loader2, Plus, Save } from 'lucide-react';
import Modal from '../Modal';

const FeedFormModal = ({ 
  feed = null, 
  isOpen, 
  onClose, 
  onSave 
}) => {

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!feed;

  useEffect(() => {
    if (feed) {
      setName(feed.name);
      setUrl(feed.url);
    } else {
      setName('');
      setUrl('');
    }
    setError('');
  }, [feed, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !url) return;
    setError('');

    setIsSubmitting(true);
    try {
      await onSave({ name, url, id: feed?.id });
      onClose();
    } catch (err) {
      console.error('Failed to save feed:', err);
      if (err instanceof Error && err.message === 'DUPLICATE_URL') {
        setError('This RSS feed has already been added.');
      } else {
        setError('Failed to save feed. Please check the URL and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit Feed' : 'Add New Feed'}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <fieldset disabled={isSubmitting} className="space-y-4">
          <legend className="sr-only">
            {isEditing ? 'Edit RSS Feed Information' : 'Add New RSS Feed Information'}
          </legend>

          <div className="space-y-1.5">
            <label htmlFor="feed-name" className="text-sm font-semibold text-gray-700 ml-1">
              Source Name
              <span className="text-red-500 ml-1" aria-label="required">*</span>
            </label>
            <input
              id="feed-name"
              type="text"
              placeholder="e.g. The Verge"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
              aria-required="true"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="feed-url" className="text-sm font-semibold text-gray-700 ml-1">
              RSS Feed URL
              <span className="text-red-500 ml-1" aria-label="required">*</span>
            </label>
            <input
              id="feed-url"
              type="url"
              placeholder="https://www.theverge.com/rss/full.xml"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              required
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'feed-url-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                error 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
            />
            {error && (
              <p 
                id="feed-url-error" 
                className="text-xs font-medium text-red-500 ml-1 animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label={isSubmitting ? 'Saving feed...' : (isEditing ? 'Save changes to feed' : 'Add new feed')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {isEditing ? <Save className="w-5 h-5" aria-hidden="true" /> : <Plus className="w-5 h-5" aria-hidden="true" />}
                  {isEditing ? 'Save Changes' : 'Add Feed'}
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
};

export default FeedFormModal;
