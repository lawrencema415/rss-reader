import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StoryList from './index';

vi.mock('../../utils/formatters', () => ({
  formatRelativeDate: (date) => `Relative ${date}`,
  getPageNumbers: () => [1],
  truncateText: (text) => text,
}));

describe('StoryList Component', () => {
  const mockStories = [
    {
      guid: '1',
      title: 'Story 1',
      description: 'Description 1',
      pubDate: '2023-01-01',
      link: 'http://example.com/1',
      thumbnail: 'image.jpg'
    },
    {
      guid: '2',
      title: 'Story 2',
      description: 'Description 2',
      pubDate: '2023-01-02',
      link: 'http://example.com/2',
    },
  ];

  const defaultProps = {
    error: null,
    feedName: 'Test Feed',
    isBookmarked: vi.fn().mockReturnValue(false),
    isLoading: false,
    onRetry: vi.fn(),
    onSelectStory: vi.fn(),
    onToggleBookmark: vi.fn(),
    stories: mockStories,
  };

  it('renders loading state', () => {
    render(<StoryList {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading latest stories...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<StoryList {...defaultProps} error="Failed to fetch" />);
    expect(screen.getByText('Unable to load feed')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls onRetry when retry button clicked', () => {
    render(<StoryList {...defaultProps} error="Failed to fetch" />);
    fireEvent.click(screen.getByText('Try Again'));
    expect(defaultProps.onRetry).toHaveBeenCalled();
  });

  it('renders empty state', () => {
    render(<StoryList {...defaultProps} stories={[]} />);
    expect(screen.getByText('No stories found')).toBeInTheDocument();
  });

  it('renders stories list', () => {
    render(<StoryList {...defaultProps} />);
    expect(screen.getByText('Story 1')).toBeInTheDocument();
    expect(screen.getByText('Story 2')).toBeInTheDocument();
  });

  it('calls onSelectStory when clicking a story', () => {
    render(<StoryList {...defaultProps} />);
    fireEvent.click(screen.getByText('Story 1'));
    // Story title is within the article which has the handler
    expect(defaultProps.onSelectStory).toHaveBeenCalledWith(mockStories[0]);
  });

  it('shows correct bookmark icon based on isBookmarked', () => {
    const isBookmarked = vi.fn((guid) => guid === '1');
    render(<StoryList {...defaultProps} isBookmarked={isBookmarked} />);
    
    // Story 1 is bookmarked
    // We can assume the button title/aria-label changes
    const removeButtons = screen.getAllByLabelText('Remove bookmark');
    expect(removeButtons).toHaveLength(1);
    
    // Story 2 is NOT bookmarked
    const addButtons = screen.getAllByLabelText('Add bookmark');
    expect(addButtons).toHaveLength(1);
  });

  it('calls onToggleBookmark when bookmark button clicked', () => {
    render(<StoryList {...defaultProps} />);
    const buttons = screen.getAllByLabelText('Add bookmark'); // all are unbookmarked by default mock
    fireEvent.click(buttons[0]);
    expect(defaultProps.onToggleBookmark).toHaveBeenCalledWith(mockStories[0]);
  });
});
