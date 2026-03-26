const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const printBtn = document.getElementById('printBtn');
const navLinks = document.querySelectorAll('.nav-link');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}


function toggleNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeNav() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        closeNav();

        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    }
}

function handlePrint() {
    window.print();
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');

                setTimeout(() => {
                    progressBar.style.setProperty('--progress-width', `${progress}%`);
                    progressBar.classList.add('animated');
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navHeight = document.querySelector('.nav').offsetHeight;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function updateScrollProgress() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        if (scrolled > 50) {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            handlePrint();
        }
        
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeNav();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

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

function handleResize() {
    const debouncedResize = debounce(() => {
        if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
            closeNav();
        }
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
}

function initLoadingAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

function initAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
    
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.setAttribute('aria-label', `Section ${index + 1}`);
    });
}

function initPrintListeners() {
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
}

function init() {
    initTheme();
    themeToggle.addEventListener('click', toggleTheme);
    
    navToggle.addEventListener('click', toggleNav);
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    printBtn.addEventListener('click', handlePrint);
    initPrintListeners();

    animateSkillBars();
    initScrollAnimations();
    
    highlightActiveSection();
    updateScrollProgress();
    
    handleResize();
    initKeyboardNav();
    initLoadingAnimation();
    initAccessibility();
    
    console.log('CV Website Initialized ✓');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        toggleNav,
        smoothScroll,
        handlePrint
    };
}