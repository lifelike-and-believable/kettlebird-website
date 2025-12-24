/**
 * Main JavaScript File
 * Add your custom JavaScript functionality here
 */

// Constants
// Note: Update this if you change --transition-speed in css/main.css
const TRANSITION_DURATION = 300; // 300ms = 0.3s (matches CSS --transition-speed)

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Initialize functionality
    initNavigation();
    initContactForm();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for hash links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Contact form functionality
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Here you would typically send the form data to a server
            console.log('Form submitted!');
            
            // Show success message
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

/**
 * Display form success/error message
 */
function showFormMessage(message, type = 'success') {
    // Remove any existing messages first
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    
    // Insert after form
    const form = document.querySelector('.contact__form');
    if (form) {
        form.insertAdjacentElement('afterend', messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), TRANSITION_DURATION);
        }, 5000);
    }
}

/**
 * Utility function: Debounce
 * Limits the rate at which a function can fire
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Example: Add scroll reveal animations
 * Uncomment to enable
 */
/*
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}
*/
