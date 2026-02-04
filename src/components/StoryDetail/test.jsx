import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StoryDetail from './index';

vi.mock('../../utils/formatters', () => ({
  formatFullDate: (date) => `Formatted ${date}`,
}));

describe('StoryDetail Component', () => {
  const mockStory = {
    title: 'Test Story',
    content: '<p>Story Content</p>',
    author: 'Test Author',
    pubDate: '2023-01-01',
    link: 'https://example.com/story',
  };

  const defaultProps = {
    feedName: 'Test Feed',
    isBookmarked: false,
    onBack: vi.fn(),
    onToggleBookmark: vi.fn(),
    story: mockStory,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders story details correctly', () => {
    render(<StoryDetail {...defaultProps} />);
    expect(screen.getByText('Test Story')).toBeInTheDocument();
    expect(screen.getByText('Test Feed')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Formatted 2023-01-01')).toBeInTheDocument();
    expect(screen.getByText('Story Content')).toBeInTheDocument();
  });

  it('uses description if content is missing', () => {
    const storyWithDesc = { ...mockStory, content: null, description: 'Description' };
    render(<StoryDetail {...defaultProps} story={storyWithDesc} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('calls onBack when back button clicked', () => {
    render(<StoryDetail {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Go back'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('shows correct bookmark state', () => {
    const { rerender } = render(<StoryDetail {...defaultProps} isBookmarked={false} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    
    rerender(<StoryDetail {...defaultProps} isBookmarked={true} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('calls onToggleBookmark when bookmark button clicked', () => {
    render(<StoryDetail {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Save bookmark'));
    expect(defaultProps.onToggleBookmark).toHaveBeenCalled();
  });

  it('render social links correctly', () => {
    render(<StoryDetail {...defaultProps} />);
    expect(screen.getByText('Facebook')).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(mockStory.link)));
    expect(screen.getByText('Tweet')).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(mockStory.link)));
    expect(screen.getByText('Email')).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  // Testing the auto-hide header logic might be tricky with JSDOM timers and mouse events,
  // but we can try basic visibility check.
  it('header is initially visible', () => {
    render(<StoryDetail {...defaultProps} />);
    const header = screen.getByTitle('Go back').closest('div').parentElement;
    expect(header).toHaveClass('translate-y-0');
  });
});
