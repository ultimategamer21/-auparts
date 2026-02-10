// Starfield Animation - matching aucustomz.net style
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.numStars = 150;

        this.resize();
        this.initStars();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.3 + 0.1,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    animate() {
        // Clear with pure black
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let star of this.stars) {
            // Slow downward drift
            star.y += star.speed;

            // Wrap around
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }

            // Subtle twinkle effect
            star.twinkle += 0.02;
            const twinkleOpacity = star.opacity * (0.7 + 0.3 * Math.sin(star.twinkle));

            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Starfield
    const canvas = document.getElementById('starfield');
    if (canvas) {
        new Starfield(canvas);
    }

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cart functionality
    let cartCount = 0;
    const cartCountEl = document.querySelector('.cart-count');

    document.querySelectorAll('.btn-add, .btn-choose').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('btn-add')) {
                cartCount++;
                cartCountEl.textContent = cartCount;

                // Button feedback
                const originalText = btn.textContent;
                btn.textContent = 'Added!';
                btn.style.background = '#3ED660';
                btn.style.color = '#000';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 1200);
            }
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');

            btn.textContent = '✓';
            btn.style.background = '#3ED660';
            input.value = '';

            setTimeout(() => {
                btn.textContent = '→';
                btn.style.background = '';
            }, 2000);
        });
    }
});
