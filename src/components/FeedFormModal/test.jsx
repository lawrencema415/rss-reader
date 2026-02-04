import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeedFormModal from './index';

describe('FeedFormModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn().mockResolvedValue({}),
  };

  it('renders correctly for adding a new feed', () => {
    render(<FeedFormModal {...defaultProps} />);
    expect(screen.getByText('Add New Feed')).toBeInTheDocument();
    expect(screen.getByLabelText(/Source Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RSS Feed URL/i)).toBeInTheDocument();
    expect(screen.getByText('Add Feed')).toBeInTheDocument();
  });

  it('renders correctly for editing an existing feed', () => {
    const feed = { id: 1, name: 'Existing Feed', url: 'https://example.com/rss' };
    render(<FeedFormModal {...defaultProps} feed={feed} />);
    expect(screen.getByText('Edit Feed')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Feed')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/rss')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('calls onSave with input values on submit', async () => {
    render(<FeedFormModal {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/Source Name/i), { target: { value: 'New Source' } });
    fireEvent.change(screen.getByLabelText(/RSS Feed URL/i), { target: { value: 'https://newsource.com/rss' } });
    
    fireEvent.click(screen.getByText('Add Feed'));
    
    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        name: 'New Source',
        url: 'https://newsource.com/rss',
        id: undefined,
      });
    });
  });

  it('shows error message when onSave fails with DUPLICATE_URL', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('DUPLICATE_URL'));
    render(<FeedFormModal {...defaultProps} onSave={onSave} />);
    
    fireEvent.change(screen.getByLabelText(/Source Name/i), { target: { value: 'Duplicate' } });
    fireEvent.change(screen.getByLabelText(/RSS Feed URL/i), { target: { value: 'https://duplicate.com/rss' } });
    
    fireEvent.click(screen.getByText('Add Feed'));
    
    expect(await screen.findByText('This RSS feed has already been added.')).toBeInTheDocument();
  });

  it('clears error when input changes', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('DUPLICATE_URL'));
    render(<FeedFormModal {...defaultProps} onSave={onSave} />);
    
    fireEvent.change(screen.getByLabelText(/Source Name/i), { target: { value: 'Duplicate' } });
    fireEvent.change(screen.getByLabelText(/RSS Feed URL/i), { target: { value: 'https://duplicate.com/rss' } });
    fireEvent.click(screen.getByText('Add Feed'));
    
    expect(await screen.findByText('This RSS feed has already been added.')).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/RSS Feed URL/i), { target: { value: 'https://newurl.com/rss' } });
    expect(screen.queryByText('This RSS feed has already been added.')).not.toBeInTheDocument();
  });
});
