/**
 * Syrian Renaissance Platform - Main JavaScript
 * Handles general UI interactions and utilities
 */

// ====================================
// Smooth Scrolling
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ====================================
// Intersection Observer for Animations
// ====================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// ====================================
// Toast Notifications
// ====================================
window.showToast = function(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast alert alert-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ====================================
// Modal Management
// ====================================
window.showModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.hideModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

// Close modal on background click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    hideModal(e.target.id);
  }
});

// ====================================
// Loading Spinner
// ====================================
window.showLoading = function(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = true;
    button.innerHTML = '<div class="spinner mx-auto"></div>';
  }
};

window.hideLoading = function(buttonId, originalText) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = false;
    button.innerHTML = originalText;
  }
};

// ====================================
// Form Validation Helpers
// ====================================
window.validateEmail = function(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

window.validatePassword = function(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8;
};

window.validateUsername = function(username) {
  // At least 3 characters, alphanumeric and underscore
  return /^[\u0600-\u06FFa-zA-Z0-9_]{3,}$/.test(username);
};

// ====================================
// Local Storage Helpers
// ====================================
window.storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  }
};

// ====================================
// Date Formatting (Arabic)
// ====================================
window.formatDate = function(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('ar-SA', options);
};

window.formatTime = function(date) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('ar-SA', options);
};

// ====================================
// Copy to Clipboard
// ====================================
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('تم النسخ بنجاح!', 'success');
  }).catch(() => {
    showToast('فشل النسخ', 'error');
  });
};

// ====================================
// Debounce Function
// ====================================
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ====================================
// Check if user is authenticated
// ====================================
window.isAuthenticated = function() {
  const token = storage.get('accessToken');
  return token !== null && token !== undefined;
};

// ====================================
// Redirect if not authenticated
// ====================================
window.requireAuth = function() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
};

// ====================================
// Logout Function
// ====================================
window.logout = async function() {
  try {
    // Call logout API
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storage.get('accessToken')}`
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear storage and redirect
    storage.clear();
    window.location.href = 'index.html';
  }
};

// ====================================
// Initialize on DOM Ready
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌸 Syrian Renaissance Platform - Frontend Ready');

  // Check if on protected page
  const protectedPages = ['dashboard.html', 'profile.html', 'modules.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage)) {
    requireAuth();
  }
});

// ====================================
// Handle Navigation Active State
// ====================================
const currentPath = window.location.pathname;
document.querySelectorAll('nav a').forEach(link => {
  if (link.getAttribute('href') === currentPath.split('/').pop()) {
    link.classList.add('text-green-600', 'font-bold');
  }
});

// ====================================
// Mobile Menu Toggle (if needed)
// ====================================
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// ====================================
// Keyboard Shortcuts
// ====================================
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K: Search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    // Open search modal (if exists)
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.focus();
  }

  // ESC: Close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      hideModal(modal.id);
    });
  }
});

// ====================================
// Print Page
// ====================================
window.printPage = function() {
  window.print();
};

// ====================================
// Share Functionality
// ====================================
window.shareContent = async function(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      showToast('تمت المشاركة بنجاح!', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
  } else {
    copyToClipboard(url);
    showToast('تم نسخ الرابط!', 'info');
  }
};

// ====================================
// Console Welcome Message
// ====================================
console.log(`
%c🌸 منصة النهضة السورية
%cمرحباً بك في رحلة التحول!

Built with ❤️ for the Syrian community
`,
  'font-size: 20px; font-weight: bold; color: #2E7D32;',
  'font-size: 14px; color: #666;'
);
