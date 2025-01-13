// accordion.js
document.querySelectorAll('.accordion-header').forEach(item => {
    item.addEventListener('click', () => {
        const parent = item.parentNode;

        // Toggle active class
        parent.classList.toggle('active');

        // Change icon from + to -
        const icon = item.querySelector('.accordion-icon');
        icon.textContent = parent.classList.contains('active') ? '-' : '+';

        // Adjust content height based on active class
        const content = parent.querySelector('.accordion-content');
        if (parent.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = '0';
        }
    });
});
