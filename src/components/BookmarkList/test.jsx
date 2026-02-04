import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookmarkList from './index';

// Mock child components and utils
vi.mock('../ConfirmModal', () => ({
  default: ({ isOpen, onConfirm, onClose, title }) => (
    isOpen ? (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <button onClick={onConfirm}>Do Confirm</button>
        <button onClick={onClose}>Do Cancel</button>
      </div>
    ) : null
  ),
}));

vi.mock('../../utils/formatters', () => ({
  formatRelativeDate: (date) => `Relative ${date}`,
  formatSimpleDate: (date) => `Simple ${date}`,
  getPageNumbers: () => [1],
  truncateText: (text) => text,
}));

describe('BookmarkList Component', () => {
  const mockBookmarks = [
    {
      guid: '1',
      title: 'Story 1',
      description: 'Description 1',
      feedName: 'Feed 1',
      bookmarkedAt: '2023-01-01',
      pubDate: '2023-01-01',
      link: 'http://example.com/1',
    },
    {
      guid: '2',
      title: 'Story 2',
      description: 'Description 2',
      feedName: 'Feed 2',
      bookmarkedAt: '2023-01-02',
      pubDate: '2023-01-02',
      link: 'http://example.com/2',
    },
  ];

  const defaultProps = {
    bookmarks: mockBookmarks,
    onClearAll: vi.fn(),
    onRemoveBookmark: vi.fn(),
    onSelectStory: vi.fn(),
  };

  it('renders empty state when no bookmarks', () => {
    render(<BookmarkList {...defaultProps} bookmarks={[]} />);
    expect(screen.getByText('No bookmarks yet')).toBeInTheDocument();
  });

  it('renders bookmarks list correctly', () => {
    render(<BookmarkList {...defaultProps} />);
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('2 saved stories')).toBeInTheDocument();
    expect(screen.getByText('Story 1')).toBeInTheDocument();
    expect(screen.getByText('Story 2')).toBeInTheDocument();
  });

  it('calls onSelectStory when clicking a story', () => {
    render(<BookmarkList {...defaultProps} />);
    fireEvent.click(screen.getByText('Story 1'));
    expect(defaultProps.onSelectStory).toHaveBeenCalledWith(mockBookmarks[0]);
  });

  it('calls onRemoveBookmark when clicking remove button', () => {
    render(<BookmarkList {...defaultProps} />);
    const removeButtons = screen.getAllByLabelText('Remove bookmark');
    fireEvent.click(removeButtons[0]);
    expect(defaultProps.onRemoveBookmark).toHaveBeenCalledWith('1');
  });

  it('opens confirm modal when clicking Clear All', () => {
    render(<BookmarkList {...defaultProps} />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('calls onClearAll when confirming in modal', () => {
    render(<BookmarkList {...defaultProps} />);
    fireEvent.click(screen.getByText('Clear All'));
    fireEvent.click(screen.getByText('Do Confirm'));
    expect(defaultProps.onClearAll).toHaveBeenCalled();
  });
});
