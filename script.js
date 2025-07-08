/**
 * Portfolio Website - Interactive Functionality
 *
 * Features:
 * - Mobile navigation toggle
 * - Smooth scrolling for anchor links with header offset
 * - Project filtering system with smooth transitions
 * - Expandable experience sections with animated reveal
 * - Skill bar fill animation on scroll
 * - Active navigation link highlighting based on scroll position
 * - Contact form handling with validation and feedback
 * - Dynamic copyright year
 * - Accessibility enhancements (skip link, keyboard navigation focus)
 * - Back to top button functionality
 */

document.addEventListener('DOMContentLoaded', function() {

    // Cache common DOM elements for efficiency
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('main section[id]'); // All main content sections
    const navLinksList = document.querySelectorAll('.nav-links a');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectEntries = document.querySelectorAll('.project-entry');
    const projectsSection = document.getElementById('projects');
    const contactForm = document.querySelector('.contact-form');
    const skillBars = document.querySelectorAll('.skill-level-bar');
    const skillsSection = document.getElementById('skills');
    const backToTopButton = document.querySelector('.back-to-top');

    // Set a CSS variable for navbar height for use in responsive styles (e.g., mobile menu top position)
    // This needs to be done after the navbar has rendered to get its correct height.
    const setNavbarHeightVar = () => {
        if (navbar) {
            document.documentElement.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`);
        }
    };

    // Call it initially and on window resize
    setNavbarHeightVar();
    window.addEventListener('resize', debounce(setNavbarHeightVar, 100)); // Debounce to prevent excessive calls


    // ==========================================================================
    // Mobile Navigation Toggle
    // Handles opening/closing the mobile menu and toggling the icon.
    // ==========================================================================
    if (menuToggle && navLinks && navbar) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active'); // Toggles the 'active' class for CSS styling

            // Toggle icon between bars (hamburger) and times (X)
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close mobile menu when clicking on a navigation link
        // This improves user experience by collapsing the menu after a selection is made.
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });
    }

    // ==========================================================================
    // Smooth Scrolling for Anchor Links
    // This function handles smooth scrolling for all internal anchor links,
    // accounting for the fixed header height and updating the URL hash.
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default instant jump

            const targetId = this.getAttribute('href');
            // Do not attempt to scroll if href is just "#" or empty
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset for fixed header to prevent content being hidden behind it
                const headerOffset = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Perform the smooth scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without causing a page reload or jump (for direct linking/bookmarking)
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }

                // Immediately update the active navigation link after click
                updateActiveNavLink(targetId);
            }
        });
    });

    // ==========================================================================
    // Active Navigation Link Highlighting on Scroll
    // Uses IntersectionObserver to highlight the current section in the navigation.
    // ==========================================================================
    // Function to update the active navigation link visually and for accessibility (aria-current)
    function updateActiveNavLink(currentId) {
        navLinksList.forEach(link => {
            link.removeAttribute('aria-current'); // Remove from all links
            link.classList.remove('active-section'); // Remove visual active class from all

            if (link.getAttribute('href') === currentId) {
                link.setAttribute('aria-current', 'page'); // Set for the current page/section
                link.classList.add('active-section'); // Add visual active class
            }
        });
    }

    // Intersection Observer options:
    // root: null means the viewport is the root.
    // rootMargin: Defines a margin around the root. Here, it creates a "trigger zone"
    // that's 50% from the top and 49% from the bottom, effectively triggering when
    // the *center* of a section crosses the center of the viewport.
    // threshold: 0 means the callback fires as soon as any part of the target enters/exits.
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -49% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When a section is intersecting this central zone, set its corresponding nav link as active
                const currentId = `#${entry.target.id}`;
                updateActiveNavLink(currentId);
            }
        });
    }, sectionObserverOptions);

    // Observe each main content section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Initial check on page load to set the correct active link if loaded with a hash in URL
    updateActiveNavLink(window.location.hash || '#about');


    // ==========================================================================
    // Project Filtering System
    // Filters project entries based on selected category with smooth transitions.
    // ==========================================================================
    if (filterButtons.length && projectEntries.length && projectsSection) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state for filter buttons (visual and accessibility)
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                const filterValue = this.getAttribute('data-filter');

                // Apply filtering with CSS transitions
                projectEntries.forEach(project => {
                    // Split the data-category string by space to handle multiple categories
                    const projectCategories = project.getAttribute('data-category').split(' ');
                    // Determine if the project should be shown based on the filter value
                    const shouldShow = filterValue === 'all' || projectCategories.includes(filterValue);

                    if (shouldShow) {
                        // If showing, ensure it's displayed as block first to allow height calculation
                        project.style.display = 'block';
                        // Use a small timeout to ensure reflow before applying transition properties
                        setTimeout(() => {
                            project.classList.remove('is-hidden'); // Remove hide class to trigger show animation
                            // Reset height, padding, margin to auto/default after a brief delay
                            // This allows the CSS transition to work from 0 to auto/default
                            project.style.height = ''; // Let CSS handle height
                            project.style.padding = ''; // Let CSS handle padding
                            project.style.marginBottom = ''; // Let CSS handle margin
                        }, 10);
                    } else {
                        // If hiding, set its current height explicitly before applying 'is-hidden'
                        // This allows CSS to transition from its current height to 0
                        project.style.height = project.scrollHeight + 'px'; // Set explicit height for transition
                        project.style.padding = '0'; // Animate padding to 0
                        project.style.marginBottom = '0'; // Animate margin to 0
                        // Use a small timeout to ensure height is set before adding 'is-hidden'
                        setTimeout(() => {
                            project.classList.add('is-hidden'); // Add hide class to trigger hide animation
                            // After the transition completes, set display to 'none' to remove it from document flow
                            project.addEventListener('transitionend', function handler() {
                                if (project.classList.contains('is-hidden')) {
                                    project.style.display = 'none';
                                }
                                project.removeEventListener('transitionend', handler);
                            }, { once: true }); // Ensure this listener runs only once
                        }, 10);
                    }
                });

                // Smooth scroll to projects section if it's not fully in view after filtering
                const projectsRect = projectsSection.getBoundingClientRect();
                const headerOffset = navbar ? navbar.offsetHeight : 0;
                if (projectsRect.top < headerOffset || projectsRect.bottom > window.innerHeight) {
                    window.scrollTo({
                        top: projectsSection.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // Expandable Experience Sections
    // Handles the animated expand/collapse of detailed experience descriptions.
    // ==========================================================================
    document.querySelectorAll('.btn-expand').forEach(button => {
        button.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded); // Toggle aria-expanded state

            const targetId = this.getAttribute('aria-controls');
            const target = document.getElementById(targetId); // The .expanded-details div

            if (target) {
                if (!expanded) { // If currently hidden, show it
                    target.style.display = 'block'; // Make it display block to calculate scrollHeight
                    target.hidden = false; // Remove hidden attribute for accessibility
                    // Set maxHeight to its scrollHeight to animate from 0 to full height
                    target.style.maxHeight = target.scrollHeight + 'px';
                    target.style.opacity = '1';
                    target.style.paddingTop = '1.5rem'; // Animate padding in
                    target.style.paddingBottom = '1.5rem'; // Animate padding in

                    // After the opening transition, set maxHeight to 'none' to allow responsive height
                    target.addEventListener('transitionend', function handler() {
                        if (!target.hidden) { // Only remove if still visible
                            target.style.maxHeight = 'none';
                        }
                        target.removeEventListener('transitionend', handler);
                    }, { once: true });

                } else { // If currently visible, hide it
                    // Set maxHeight to its current scrollHeight before animating to 0
                    target.style.maxHeight = target.scrollHeight + 'px';
                    target.style.opacity = '0';
                    target.style.paddingTop = '0'; // Animate padding out
                    target.style.paddingBottom = '0'; // Animate padding out

                    // Use a small timeout to ensure the browser registers the current height
                    // before starting the transition to 0.
                    setTimeout(() => {
                        target.style.maxHeight = '0'; // Animate height to 0
                    }, 10);

                    // After the closing transition, set display to 'none' and add hidden attribute
                    target.addEventListener('transitionend', function handler() {
                        if (target.style.maxHeight === '0px') { // Check if transition to 0px height is complete
                            target.style.display = 'none';
                            target.hidden = true;
                        }
                        target.removeEventListener('transitionend', handler);
                    }, { once: true });
                }
            }
        });
    });

    // Initialize all expandable sections to be hidden on page load
    document.querySelectorAll('.expanded-details').forEach(detail => {
        detail.style.maxHeight = '0';
        detail.style.opacity = '0';
        detail.style.paddingTop = '0';
        detail.style.paddingBottom = '0';
        detail.style.display = 'none';
        detail.hidden = true; // Ensure hidden attribute is set
    });


    // ==========================================================================
    // Skill Bar Fill Animation on Scroll
    // Animates the width of skill bars when the skills section enters the viewport.
    // ==========================================================================
    if (skillsSection && skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When the skills section comes into view, animate each skill bar
                    skillBars.forEach(bar => {
                        const targetWidth = bar.style.width; // Get the target width (e.g., '95%') from inline style
                        bar.style.width = '0%'; // Reset width to 0% to prepare for animation
                        // Small timeout to ensure the browser registers the 0% width before animating
                        setTimeout(() => {
                            bar.style.width = targetWidth; // Animate to its actual width
                        }, 100);
                    });
                    observer.unobserve(skillsSection); // Stop observing once animation is triggered
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the skills section is visible
        });

        skillObserver.observe(skillsSection);
    }


    // ==========================================================================
    // Section Fade-In on Scroll Animation (General Sections)
    // Applies a fade-in and slight slide-up effect to main content sections.
    // ==========================================================================
    // Selects direct <section> children of <main> to apply the animation
    const generalSections = document.querySelectorAll('main > section');

    const sectionFadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // Add class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Adjust to trigger slightly before reaching the bottom
    });

    generalSections.forEach(section => {
        sectionFadeInObserver.observe(section);
    });


    // ==========================================================================
    // Back to Top Button Functionality
    // Shows/hides the back-to-top button based on scroll position.
    // ==========================================================================
    if (backToTopButton) {
        const toggleBackToTop = () => {
            // Show button after scrolling 300px down
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show'); // Add 'show' class to make it visible
            } else {
                backToTopButton.classList.remove('show'); // Remove 'show' class to hide it
            }
        };

        toggleBackToTop(); // Initial check on page load

        // Use a throttled scroll event listener for performance to avoid excessive calls
        window.addEventListener('scroll', throttle(toggleBackToTop, 200));

        // Add click listener for smooth scroll to top
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // Contact Form Handling
    // Handles client-side validation and submission feedback for the contact form.
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const nameInput = this.querySelector('#full-name');
            const emailInput = this.querySelector('#email-address');
            const messageInput = this.querySelector('#message');
            let isValid = true;

            // Clear previous error messages and input error states before re-validating
            this.querySelectorAll('.error-message').forEach(el => el.remove());
            this.querySelectorAll('input, textarea').forEach(input => {
                input.classList.remove('input-error');
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            });
            const existingFormMessage = this.querySelector('.form-message');
            if (existingFormMessage) existingFormMessage.remove();

            // Validate name field
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your full name.');
                isValid = false;
            }

            // Validate email field
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email address.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) { // Check for valid email format
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate message field
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message.');
                isValid = false;
            }

            if (isValid) {
                const formData = new FormData(this); // Collect form data
                const submitButton = this.querySelector('button[type="submit"]');
                const originalButtonContent = submitButton.innerHTML; // Store original button content

                // Show loading state on the submit button
                submitButton.disabled = true; // Disable button to prevent multiple submissions
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...'; // Show spinner
                submitButton.classList.add('sending'); // Add class for potential loading styles

                // Use Fetch API to submit the form data (Formspree endpoint)
                fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Request JSON response from Formspree
                    }
                })
                .then(response => {
                    if (response.ok) {
                        showFormMessage(this, 'Message sent successfully! I will get back to you soon.', 'success');
                        this.reset(); // Clear the form fields on success
                    } else {
                        // Handle non-OK responses (e.g., server errors, Formspree specific errors)
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || 'Network response was not ok');
                        }).catch(() => {
                            throw new Error('Network response was not ok, and no specific error message.');
                        });
                    }
                })
                .catch(error => {
                    // Display a general error message to the user and log the error
                    showFormMessage(this, 'There was a problem sending your message. Please try again later.', 'error');
                    console.error('Form submission error:', error);
                })
                .finally(() => {
                    // Always reset button state after submission attempt (success or failure)
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonContent; // Restore original button content
                    submitButton.classList.remove('sending');
                });
            }
        });
    }

    // Helper function to display input-specific error messages
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const errorElement = document.createElement('p');
            errorElement.className = 'error-message'; // Class for styling error messages
            errorElement.textContent = message;
            errorElement.id = `${input.id}-error`; // Assign unique ID for accessibility (aria-describedby)

            formGroup.appendChild(errorElement); // Insert error message below the input
            input.classList.add('input-error'); // Add class to input for error styling (e.g., red border)
            input.setAttribute('aria-invalid', 'true'); // Indicate invalid input for screen readers
            input.setAttribute('aria-describedby', errorElement.id); // Link input to its error message
        }
    }

    // Helper function to validate email format using a simple regex
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Helper function to display general form messages (success or error)
    function showFormMessage(form, message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`; // Add type class for styling
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert'); // ARIA role for accessibility alerts

        form.insertBefore(messageElement, form.firstChild); // Insert message at the top of the form

        // Scroll to the message for immediate user visibility
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ==========================================================================
    // Dynamic Copyright Year
    // Automatically updates the copyright year in the footer.
    // ==========================================================================
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // Accessibility Enhancements (Keyboard Navigation Focus & Skip Link)
    // ==========================================================================

    // Add 'keyboard-nav' class to body when using tab key for custom focus outlines
    document.body.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    // Remove 'keyboard-nav' class when mouse is used, to hide focus outlines for mouse users
    document.body.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Ensure skip-link is functional and focuses correctly on main content
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump behavior
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus(); // Programmatically focus on the main content area
                // If the target element is not naturally focusable, make it so temporarily
                if (target.getAttribute('tabindex') === null) {
                    target.setAttribute('tabindex', '-1'); // Make it focusable but not part of tab order
                    // Remove tabindex once focus is lost to clean up
                    target.addEventListener('blur', function handler() {
                        target.removeAttribute('tabindex');
                        target.removeEventListener('blur', handler);
                    }, { once: true });
                }
            }
        });
    }

    // ==========================================================================
    // Lazy Loading for Images (Fallback for browsers without native support)
    // Modern browsers support `loading="lazy"` natively. This provides a JS fallback
    // for older browsers by using IntersectionObserver.
    // ==========================================================================
    if (!('loading' in HTMLImageElement.prototype)) { // Check if native lazy loading is NOT supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Only load the image if its src is empty or still a placeholder
                    // This prevents re-loading if the browser already loaded it or if it's already set
                    if (!img.src || img.src.includes('placehold.co') || img.src === window.location.href) { // Added check for empty src
                        img.src = img.dataset.src; // Load the actual image from data-src
                    }
                    lazyLoadObserver.unobserve(img); // Stop observing once the image is loaded
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px' // Load images when they are 200px from entering the viewport
        });

        lazyImages.forEach(img => {
            // If native lazy loading is not supported, and data-src is available,
            // move the original src to data-src and clear the src attribute
            // so the IntersectionObserver can manage loading.
            if (img.dataset.src && img.src !== img.dataset.src) { // Ensure we don't clear if already loaded
                img.src = ''; // Clear src to prevent eager loading
            }
            lazyLoadObserver.observe(img);
        });
    }

    // ==========================================================================
    // Utility Functions (Debounce & Throttle)
    // These functions help optimize performance by limiting how often
    // certain event handlers (like scroll) are executed.
    // ==========================================================================

    /**
     * Debounce function: Ensures a function is called only after a specified
     * delay has passed since the last time it was invoked. Useful for resize, keyup events.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    /**
     * Throttle function: Ensures a function is called at most once within a
     * specified time period. Useful for scroll, mousemove events.
     * @param {Function} func - The function to throttle.
     * @param {number} limit - The time limit in milliseconds.
     * @returns {Function} - The throttled function.
     */
    function throttle(func, limit) {
        let inThrottle;
        let lastResult;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                inThrottle = true;
                lastResult = func.apply(context, args);
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
            return lastResult;
        };
    }
});

