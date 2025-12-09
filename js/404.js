// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeIcon() {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

const currentTheme = getInitialTheme();
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// Matrix rain effect
function createMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    for (let i = 0; i < 50; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.animationDelay = Math.random() * 2 + 's';

        let text = '';
        for (let j = 0; j < 20; j++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        column.innerHTML = text;

        matrixRain.appendChild(column);
    }
}

// Floating particles
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
    particle.style.color = Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--accent-secondary)';
    particle.style.animationDuration = (Math.random() * 10 + 5) + 's';

    const symbols = ['{}', '[]', '()', '<>', '/>', '&&', '||', '==', '!=', '++', '--', '=>'];
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// Search functionality
let searchData = [];

async function loadSearchData() {
    try {
        // Try multiple possible endpoints
        const endpoints = ['/index.json', '/'];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    if (endpoint === '/') {
                        // If we're fetching the home page, we need to extract JSON from it
                        const text = await response.text();
                        // This is a fallback - in a real scenario, we'd have proper JSON endpoint
                        searchData = [];
                        return;
                    } else {
                        searchData = await response.json();
                        return;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback data if all endpoints fail
        searchData = [];
    } catch (error) {
        console.log('Could not load search data, using fallback');
        // Fallback search data
        searchData = [];
    }
}

function performSearch(query) {
    const results = document.getElementById('searchResults');

    if (!query.trim()) {
        results.classList.remove('show');
        return;
    }

    const searchLower = query.toLowerCase();
    const matches = searchData.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    ).slice(0, 5);

    if (matches.length === 0) {
        results.innerHTML = '<div class="no-results">No posts found. Try different keywords!</div>';
    } else {
        results.innerHTML = matches.map(post => `
            <div class="search-result" onclick="window.location.href='${post.url}'">
                <div class="result-title">${post.title}</div>
                <div class="result-excerpt">${post.excerpt.substring(0, 100)}...</div>
            </div>
        `).join('');
    }

    results.classList.add('show');
}

// Random post functionality
function getRandomPost() {
    if (searchData.length > 0) {
        const randomPost = searchData[Math.floor(Math.random() * searchData.length)];
        window.location.href = randomPost.url;
    } else {
        window.location.href = '/';
    }
}

// Load recent posts for git log
function loadRecentPosts() {
    const gitLogContent = document.getElementById('gitLogContent');

    if (searchData.length > 0) {
        const recentPosts = searchData.slice(0, 5);
        gitLogContent.innerHTML = recentPosts.map((post, index) => {
            const hash = Math.random().toString(36).substring(2, 9);
            const timeAgo = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago'][index] || '1 month ago';

            return `
                <div class="git-commit">
                    <span class="commit-hash">${hash}</span>
                    <div class="commit-message">
                        <a href="${post.url}">feat: ${post.title}</a>
                    </div>
                    <span class="commit-date">${timeAgo}</span>
                </div>
            `;
        }).join('');
    }
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', (e) => {
    performSearch(e.target.value);
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (query.trim()) {
        performSearch(query);
    }
});

document.getElementById('randomPostBtn').addEventListener('click', getRandomPost);

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('searchResults').classList.remove('show');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('searchResults').classList.remove('show');
    }
    if (e.key === '/' && !e.target.matches('input')) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Initialize everything
createMatrixRain();
loadSearchData().then(() => {
    loadRecentPosts();
});

// Create particles periodically
setInterval(createParticle, 2000);

// Console easter egg
console.log(`
404: Oops... Something's Gone Wrong

Well, well, well... looks like you found the console!

Here are some secret shortcuts:
- Press '/' to focus the search box
- Press 'Escape' to close search results
- The matrix rain is made of real code characters!

Built with love, coffee, and way too many glitch effects.
Now get back to coding! ✨
`);
