import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './index';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSignIn.mockClear();
    mockSignOut.mockClear();
    mockUseAuth.mockReturnValue({
      user: null,
      signInWithGoogle: mockSignIn,
      signOut: mockSignOut,
    });
  });

  it('renders title and sign in button when not logged in', () => {
    render(<Header />);
    expect(screen.getByText('RSS Reader')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders user info when logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com', user_metadata: {} },
      signInWithGoogle: mockSignIn,
      signOut: mockSignOut,
    });

    render(<Header />);
    
    // Should show avatar placeholdler (letter T) or email part
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('navigates to home when title clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('RSS Reader'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to bookmarks when button clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('Bookmarks'));
    expect(mockNavigate).toHaveBeenCalledWith('/bookmarks');
  });

  it('calls signInWithGoogle when clicking sign in', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('Sign In'));
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('shows logout option when user menu clicked', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com', user_metadata: {} },
      signInWithGoogle: mockSignIn,
      signOut: mockSignOut,
    });

    render(<Header />);
    
    // Find user button
    fireEvent.click(screen.getByLabelText('User menu'));
    
    // Now menu should be visible
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.getByText('Logged in as')).toBeInTheDocument();
  });

  it('calls signOut when logout clicked', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com', user_metadata: {} },
      signInWithGoogle: mockSignIn,
      signOut: mockSignOut,
    });

    render(<Header />);
    
    fireEvent.click(screen.getByLabelText('User menu'));
    fireEvent.click(screen.getByText('Sign Out'));
    
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('hides bookmarks button when showBookmarks is false', () => {
    render(<Header showBookmarks={false} />);
    expect(screen.queryByText('Bookmarks')).not.toBeInTheDocument();
  });
});
