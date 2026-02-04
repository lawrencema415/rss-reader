import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './index';

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} title="Test Modal">
        <div>Content</div>
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} title="Test Modal">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Test Modal" onClose={onClose}>
        <div>Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when hideCloseButton is true', () => {
    render(
      <Modal isOpen={true} title="Test Modal" hideCloseButton={true}>
        <div>Content</div>
      </Modal>
    );
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal 
        isOpen={true} 
        title="Test Modal" 
        footer={<button>Footer Button</button>}
      >
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('calls onClose when clicking the background', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Test Modal" onClose={onClose}>
        <div>Content</div>
      </Modal>
    );
    
    // The background is the outermost div
    const background = screen.getByText('Test Modal').parentElement.parentElement.parentElement;
    fireEvent.click(background);
    expect(onClose).toHaveBeenCalled();
  });
});
