document.addEventListener('DOMContentLoaded', function() {
    initializeBlogFeatures();
    addMobileFeedback();
});

function initializeBlogFeatures() {
    calculateReadingTime();
    setupSocialSharing();
    setupFloatingSocial();
    setupEnhancedSmoothScrolling();
    addCodeCopyButtons();
    setupImageZoom();
    generateTOC();
    setupScrollProgress();
}

// Enhanced smooth scrolling with mobile support
function setupEnhancedSmoothScrolling() {
    const scrollOffset = 100; // Adjust for fixed headers
    const scrollDuration = 800;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            const startPosition = window.pageYOffset;
            const targetPosition = target.getBoundingClientRect().top + startPosition - scrollOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animateScroll(currentTime) {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / scrollDuration, 1);
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
                
                if (timeElapsed < scrollDuration) {
                    requestAnimationFrame(animateScroll);
                }
            }

            requestAnimationFrame(animateScroll);
        });
    });

    // Add touch support for mobile
    document.body.addEventListener('touchstart', function() {}, { passive: true });
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Mobile feedback features
function addMobileFeedback() {
    let touchStartX = 0;
    let touchStartY = 0;
    const touchThreshold = 30;

    // Touch gesture handling
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaY) > touchThreshold) {
            showScrollFeedback(deltaY > 0 ? 'down' : 'up');
        }
    }, { passive: true });

    // Visual feedback for scroll direction
    function showScrollFeedback(direction) {
        const feedback = document.createElement('div');
        feedback.className = `scroll-feedback ${direction}`;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }
}

// Scroll progress indicator
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }, { passive: true });
}

// Enhanced TOC with active state
function generateTOC() {
    const tocContainer = document.querySelector('#toc');
    const content = document.querySelector('.post-content');
    if (!tocContainer || !content) return;

    const headings = content.querySelectorAll('h2, h3');
    let tocHTML = '<h3>Table of Contents</h3><ul>';

    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;
        
        tocHTML += `
            <li class="${heading.tagName.toLowerCase()}">
                <a href="#${id}" data-target="${id}">${heading.textContent}</a>
            </li>
        `;
    });

    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;

    // Add intersection observer for active states
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const link = document.querySelector(`a[data-target="${entry.target.id}"]`);
            if (link) {
                link.classList.toggle('active', entry.isIntersecting);
            }
        });
    }, { threshold: 0.5 });

    headings.forEach(heading => observer.observe(heading));
}