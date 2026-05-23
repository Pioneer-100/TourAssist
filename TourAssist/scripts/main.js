document.addEventListener('DOMContentLoaded', () => {
    const findExperiencesBtn = document.getElementById('find-experiences-btn');
    const experienceInput = document.getElementById('experience-input');

    if (findExperiencesBtn) {
        findExperiencesBtn.addEventListener('click', () => {
            const query = experienceInput.value.trim();
            if (query) {
                // Redirect to discovery page with the query as a parameter
                window.location.href = `pages/discovery.html?q=${encodeURIComponent(query)}`;
            } else {
                alert('Please describe what you want to experience!');
            }
        });
    }

    // Also handle Enter key in the input field
    if (experienceInput) {
        experienceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                findExperiencesBtn.click();
            }
        });
    }
});
