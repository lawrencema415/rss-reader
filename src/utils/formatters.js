/**
 * Formats a date string into a relative time (e.g., "5m ago") or a short date.
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Formats a date string into a full readable format.
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatFullDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Formats a date string into a simple date format.
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatSimpleDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Truncates text to a maximum length and adds an ellipsis.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Generates an array of page numbers with ellipses for pagination.
 * @param {number} currentPage 
 * @param {number} totalPages 
 * @param {number} maxVisible 
 * @returns {(number|string)[]}
 */
export function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  const pages = [];

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    // Always show first page
    pages.push(1);

    // Show neighbors and everything between 1 and currentPage
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
  }
  return pages;
}
