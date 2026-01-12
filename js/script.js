// ================= DARK/LIGHT MODE =================
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
    if(document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

// ================= SCROLL CUE =================
const scrollIndicator = document.getElementById('scroll-indicator');
scrollIndicator.addEventListener('click', () => {
    const nextSection = document.getElementById('about');
    nextSection.scrollIntoView({ behavior: 'smooth' });
});
