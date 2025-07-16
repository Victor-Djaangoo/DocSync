// Blog-specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality for blog posts
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            blogPosts.forEach(post => {
                if (filterValue === 'all') {
                    post.style.display = 'block';
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    const postCategory = post.getAttribute('data-category');
                    if (postCategory === filterValue) {
                        post.style.display = 'block';
                        setTimeout(() => {
                            post.style.opacity = '1';
                            post.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        post.style.opacity = '0';
                        post.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            post.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });

    // Newsletter form submission for blog pages
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Obrigado por se inscrever em nosso blog! Em breve você receberá nossos melhores artigos.');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    });

    // Social sharing functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('twitter') ? 'twitter' :
                           this.classList.contains('linkedin') ? 'linkedin' :
                           this.classList.contains('whatsapp') ? 'whatsapp' : '';
            
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent(document.querySelector('.blog-subtitle')?.textContent || '');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Reading progress indicator
    function createReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        document.body.appendChild(progressBar);

        const progressFill = progressBar.querySelector('.reading-progress-fill');

        window.addEventListener('scroll', function() {
            const article = document.querySelector('.blog-content');
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            const progress = Math.min(
                Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
                1
            );

            progressFill.style.width = (progress * 100) + '%';
        });
    }

    // Add reading progress for individual blog posts
    if (document.querySelector('.blog-content')) {
        createReadingProgress();
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Copy URL functionality
    function addCopyUrlButton() {
        const shareSection = document.querySelector('.blog-share');
        if (shareSection) {
            const copyButton = document.createElement('button');
            copyButton.className = 'share-btn copy-url';
            copyButton.textContent = 'Copiar Link';
            copyButton.style.backgroundColor = '#6c757d';
            
            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.textContent = 'Link Copiado!';
                    setTimeout(() => {
                        this.textContent = 'Copiar Link';
                    }, 2000);
                });
            });
            
            const shareButtons = shareSection.querySelector('.share-buttons');
            shareButtons.appendChild(copyButton);
        }
    }

    addCopyUrlButton();

    // Estimated reading time calculation
    function calculateReadingTime() {
        const article = document.querySelector('.blog-content');
        if (!article) return;

        const text = article.textContent || article.innerText;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);

        const readingTimeElements = document.querySelectorAll('.blog-read-time');
        readingTimeElements.forEach(element => {
            if (element.textContent.includes('min de leitura')) {
                element.textContent = `${readingTime} min de leitura`;
            }
        });
    }

    calculateReadingTime();

    // Add table of contents for long articles
    function generateTableOfContents() {
        const article = document.querySelector('.blog-content');
        if (!article) return;

        const headings = article.querySelectorAll('h2, h3');
        if (headings.length < 3) return;

        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>Índice</h3><ul class="toc-list"></ul>';

        const tocList = toc.querySelector('.toc-list');

        headings.forEach((heading, index) => {
            // Add ID to heading if it doesn't have one
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const li = document.createElement('li');
            li.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-sub-item' : 'toc-item';
            li.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
            tocList.appendChild(li);
        });

        // Insert TOC after the first paragraph
        const firstParagraph = article.querySelector('p');
        if (firstParagraph) {
            firstParagraph.parentNode.insertBefore(toc, firstParagraph.nextSibling);
        }
    }

    generateTableOfContents();

    // Lazy loading for images
    const images = document.querySelectorAll('img[src="#"]');
    images.forEach(img => {
        img.style.backgroundColor = '#f0f0f0';
        img.style.minHeight = '200px';
        img.alt = img.alt || 'Imagem em carregamento...';
    });
});

// Add CSS for reading progress and table of contents
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: rgba(76, 175, 79, 0.2);
        z-index: 9999;
    }
    
    .reading-progress-fill {
        height: 100%;
        background-color: #4CAF4F;
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .table-of-contents {
        background-color: #F5F7FA;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 2rem 0;
        border-left: 4px solid #4CAF4F;
    }
    
    .table-of-contents h3 {
        margin-bottom: 1rem;
        color: #18191F;
        font-size: 1.25rem;
    }
    
    .toc-list {
        list-style: none;
        padding: 0;
    }
    
    .toc-item {
        margin-bottom: 0.5rem;
    }
    
    .toc-sub-item {
        margin-bottom: 0.25rem;
        padding-left: 1rem;
        font-size: 0.9rem;
    }
    
    .toc-list a {
        color: #4D4D4D;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .toc-list a:hover {
        color: #4CAF4F;
    }
    
    .copy-url:hover {
        background-color: #5a6268 !important;
    }
    
    @media (max-width: 768px) {
        .table-of-contents {
            padding: 1rem;
        }
        
        .toc-sub-item {
            padding-left: 0.5rem;
        }
    }
`;

document.head.appendChild(blogStyles);