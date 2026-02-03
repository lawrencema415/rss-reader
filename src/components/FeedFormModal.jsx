import { useState, useEffect } from 'react';
import { Plus, Save, Loader2 } from 'lucide-react';
import Modal from './Modal';

const FeedFormModal = ({ isOpen, onClose, onSave, feed = null }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
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
  }, [feed, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !url) return;

    setIsSubmitting(true);
    try {
      await onSave({ name, url, id: feed?.id });
      onClose();
    } catch (error) {
      console.error('Failed to save feed:', error);
      alert('Failed to save feed. Please check the URL and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit Feed' : 'Add New Feed'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-gray-700 ml-1">
            Source Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. The Verge"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="url" className="text-sm font-semibold text-gray-700 ml-1">
            RSS Feed URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="e.g. https://www.theverge.com/rss/full.xml"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isEditing ? 'Save Changes' : 'Add Feed'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedFormModal;
