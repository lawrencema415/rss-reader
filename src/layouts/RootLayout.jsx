import ConfirmModal from '@/components/ConfirmModal';
import FeedFormModal from '@/components/FeedFormModal';

const RootLayout = ({ 
  children, 
  deletingFeed, 
  editingFeed, 
  isFormModalOpen, 
  onConfirmDelete, 
  saveUserFeed, 
  setDeletingFeed, 
  setEditingFeed, 
  setIsFormModalOpen 
}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-gray-50/50">
      {children}

      <FeedFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => { setIsFormModalOpen(false); setEditingFeed(null); }}
        onSave={saveUserFeed}
        feed={editingFeed}
      />

      <ConfirmModal
        isOpen={!!deletingFeed}
        onClose={() => setDeletingFeed(null)}
        onConfirm={onConfirmDelete}
        title="Delete Feed"
        hideCloseButton={true}
        message={`Are you sure you want to delete "${deletingFeed?.name}"?`}
      />
    </div>
  );
};

export default RootLayout;
