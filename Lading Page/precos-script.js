// Pricing page specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Billing toggle functionality
    const billingToggle = document.getElementById('billing-toggle');
    const prices = document.querySelectorAll('.price');
    const annualSavings = document.querySelectorAll('.annual-savings');

    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;
            
            prices.forEach(priceElement => {
                const monthlyPrice = priceElement.getAttribute('data-monthly');
                const annualPrice = priceElement.getAttribute('data-annual');
                
                if (isAnnual) {
                    // Show annual price (monthly equivalent)
                    const annualMonthly = Math.floor(annualPrice / 12);
                    priceElement.textContent = annualMonthly;
                } else {
                    // Show monthly price
                    priceElement.textContent = monthlyPrice;
                }
            });

            // Show/hide annual savings
            annualSavings.forEach(saving => {
                saving.style.display = isAnnual ? 'block' : 'none';
            });
        });
    }

    // Plan card hover effects
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle animation or effect
            this.style.transform = this.classList.contains('popular') ? 
                'scale(1.05) translateY(-8px)' : 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('popular') ? 
                'scale(1.05)' : 'none';
        });
    });

    // CTA button click tracking
    const ctaButtons = document.querySelectorAll('.plan-cta .btn, .cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // You can add analytics tracking here
            console.log('CTA clicked:', this.textContent);
        });
    });

    // FAQ accordion functionality (optional enhancement)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        question.style.cursor = 'pointer';
        question.addEventListener('click', function() {
            // Toggle active state
            item.classList.toggle('active');
            
            // Add visual feedback for clickable questions
            if (item.classList.contains('active')) {
                question.style.color = '#4CAF4F';
            } else {
                question.style.color = '#18191F';
            }
        });
    });

    // Price animation on load
    function animateNumbers() {
        prices.forEach(priceElement => {
            const finalValue = parseInt(priceElement.textContent);
            const duration = 1000; // 1 second
            const steps = 50;
            const increment = finalValue / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                current += increment;
                step++;
                
                if (step >= steps) {
                    priceElement.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    priceElement.textContent = Math.floor(current);
                }
            }, duration / steps);
        });
    }

    // Trigger price animation when pricing section comes into view
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const pricingSection = document.querySelector('.pricing-plans');
    if (pricingSection) {
        observer.observe(pricingSection);
    }

    // Enhanced CTA button functionality
    const finalCTAButtons = document.querySelectorAll('.pricing-final-cta .btn');
    finalCTAButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const buttonText = this.textContent;
            
            if (buttonText.includes('Teste Grátis') || buttonText.includes('Começar')) {
                // Redirect to sign up or show modal
                alert('Redirecionando para cadastro... (você pode personalizar esta ação)');
            } else if (buttonText.includes('Especialista') || buttonText.includes('Vendas')) {
                // Redirect to contact or show contact modal
                alert('Redirecionando para contato... (você pode personalizar esta ação)');
            }
        });
    });

    // Plan selection highlighting
    planCards.forEach(card => {
        const ctaButton = card.querySelector('.btn');
        
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove selection from other cards
            planCards.forEach(otherCard => {
                otherCard.classList.remove('selected');
            });
            
            // Add selection to current card
            card.classList.add('selected');
            
            // Update button text to show selection
            const originalText = this.textContent;
            this.textContent = 'Selecionado ✓';
            
            setTimeout(() => {
                this.textContent = originalText;
                card.classList.remove('selected');
            }, 2000);
        });
    });

    // Smooth scrolling for comparison table
    const comparisonSection = document.querySelector('.features-comparison');
    if (comparisonSection) {
        const scrollButtons = document.querySelectorAll('[data-scroll-to="comparison"]');
        scrollButtons.forEach(button => {
            button.addEventListener('click', function() {
                comparisonSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
});

// Add CSS for enhanced effects
const pricingStyles = document.createElement('style');
pricingStyles.textContent = `
    .plan-card.selected {
        border-color: #4CAF4F;
        box-shadow: 0 8px 32px rgba(76, 175, 79, 0.2);
    }
    
    .faq-item.active {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;

document.head.appendChild(pricingStyles);