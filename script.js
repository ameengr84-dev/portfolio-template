const $ = (id) => document.getElementById(id);

// Escape HTML to prevent unsafe content injection
const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));

// Allow only valid HTTP and HTTPS links
const safe = (url) => {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
            ? parsed.href
            : '#';
    } catch {
        return '#';
    }
};
// Load portfolio data
fetch('profile.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Unable to load profile.json');
        }
        return response.json();
    })
    .then((p) => {

        document.title = `${p.name} | Engineering Portfolio`;

        // Personal information
        $('name').textContent = p.name;
        $('tagline').textContent = p.tagline;
        $('bio').textContent = p.bio;

        // Skills
        $('skills').innerHTML = (p.skills || [])
            .map((skill) => `<li>${esc(skill)}</li>`)
            .join('');

        // Projects
$('projects').innerHTML = (p.projects || [])
    .map((project) => `
        <div class="card">
            <h3>${esc(project.title)}</h3>
            <p>${esc(project.desc)}</p>
            ${project.link ? `
                <a href="${safe(project.link)}"
                   target="_blank"
                   rel="noopener noreferrer">
                   View project →
                </a>
            ` : `
                <span class="project-status">
                    Completed · Repository coming soon
                </span>
            `}
        </div>
    `)
    .join('');

                // Contact links
$('contact-links').innerHTML = Object.entries(p.links || {})
    .map(([platform, url]) => {
        const isEmailOrPhone =
            url.startsWith('mailto:') || url.startsWith('tel:');

        return `
            <a href="${safe(url)}"
                ${isEmailOrPhone ? '' : 'target="_blank"'}
                rel="noopener noreferrer">
                ${esc(platform.charAt(0).toUpperCase() + platform.slice(1))}
            </a>
        `;
    })
            .join('');
        // Footer
        $('footer').innerHTML = `
            <p>© ${new Date().getFullYear()} ${esc(p.name)}</p>
            <p>Exploring technology, one project at a time.</p>
            <a href="#name" class="back-to-top">BACK TO TOP ↑</a>
        `;

    })
    .catch((error) => {
        console.error('Portfolio loading error:', error);
        $('name').textContent = 'Unable to load portfolio';
        $('bio').textContent = 'Please check the profile configuration and refresh the page.';
    });