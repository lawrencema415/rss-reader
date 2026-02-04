import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmModal from './index';

describe('ConfirmModal Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to do this?',
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to do this?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument(); // Default confirmText
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('renders custom confirm text', () => {
    render(<ConfirmModal {...defaultProps} confirmText="Yes, Proceed" />);
    expect(screen.getByText('Yes, Proceed')).toBeInTheDocument();
  });

  it('applies destructive styles by default', () => {
    render(<ConfirmModal {...defaultProps} />);
    const confirmButton = screen.getByText('Delete');
    expect(confirmButton).toHaveClass('bg-red-500');
  });

  it('applies non-destructive styles when isDestructive is false', () => {
    render(<ConfirmModal {...defaultProps} isDestructive={false} confirmText="Save" />);
    const confirmButton = screen.getByText('Save');
    expect(confirmButton).toHaveClass('bg-orange-500');
  });
});
