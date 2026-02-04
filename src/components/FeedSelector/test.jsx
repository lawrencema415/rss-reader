import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeedSelector from './index';

describe('FeedSelector Component', () => {
  const mockFeeds = [
    { id: '1', name: 'Feed 1', isUserFeed: false },
    { id: '2', name: 'Feed 2', isUserFeed: true },
  ];

  const defaultProps = {
    feeds: mockFeeds,
    onAddFeed: vi.fn(),
    onDeleteFeed: vi.fn(),
    onEditFeed: vi.fn(),
    onSelectFeed: vi.fn(),
    selectedFeedId: '1',
    user: null,
  };

  it('renders list of feeds', () => {
    render(<FeedSelector {...defaultProps} />);
    expect(screen.getByText('Your Feeds')).toBeInTheDocument();
    expect(screen.getByText('Feed 1')).toBeInTheDocument();
    expect(screen.getByText('Feed 2')).toBeInTheDocument();
  });

  it('highlights selected feed', () => {
    render(<FeedSelector {...defaultProps} selectedFeedId="1" />);
    // Since styling logic is complex (classNames), we check if the selected feed container has a distinct class like text-white
    // Or we can check if it has the "text-white" class applied to the button text container or Rss icon.
    // The implementation uses text-white on the button when selected.
    
    // Simpler check: we can look for the button containing Feed 1 and check its class
    const feed1Button = screen.getByText('Feed 1').closest('button');
    expect(feed1Button).toHaveClass('bg-gradient-to-r');
    
    const feed2Button = screen.getByText('Feed 2').closest('button');
    expect(feed2Button).not.toHaveClass('bg-gradient-to-r');
  });

  it('calls onSelectFeed when clicking a feed', () => {
    render(<FeedSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Feed 2'));
    expect(defaultProps.onSelectFeed).toHaveBeenCalledWith('2');
  });

  it('shows add button only when user is logged in', () => {
    const { rerender } = render(<FeedSelector {...defaultProps} user={null} />);
    expect(screen.queryByTitle('Add new feed')).not.toBeInTheDocument();

    rerender(<FeedSelector {...defaultProps} user={{ id: 'user1' }} />);
    expect(screen.getByTitle('Add new feed')).toBeInTheDocument();
  });

  it('calls onAddFeed when add button is clicked', () => {
    render(<FeedSelector {...defaultProps} user={{ id: 'user1' }} />);
    fireEvent.click(screen.getByTitle('Add new feed'));
    expect(defaultProps.onAddFeed).toHaveBeenCalled();
  });

  it('shows edit/delete buttons for user feeds', () => {
    render(<FeedSelector {...defaultProps} user={{ id: 'user1' }} />);
    
    // Feed 2 is a user feed, so it should have edit/delete buttons (though initially hidden via opacity)
    // Testing library doesn't handle hover states easily for conditional rendering if strictly CSS-based,
    // but the elements are in the DOM.
    expect(screen.getByTitle('Edit feed')).toBeInTheDocument();
    expect(screen.getByTitle('Delete feed')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for non-user feeds', () => {
    render(<FeedSelector {...defaultProps} feeds={[mockFeeds[0]]} user={{ id: 'user1' }} />);
    expect(screen.queryByTitle('Edit feed')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete feed')).not.toBeInTheDocument();
  });

  it('calls onEditFeed and onDeleteFeed', () => {
    render(<FeedSelector {...defaultProps} user={{ id: 'user1' }} />);
    
    fireEvent.click(screen.getByTitle('Edit feed'));
    expect(defaultProps.onEditFeed).toHaveBeenCalledWith(mockFeeds[1]);

    fireEvent.click(screen.getByTitle('Delete feed'));
    expect(defaultProps.onDeleteFeed).toHaveBeenCalledWith(mockFeeds[1]);
  });
});
