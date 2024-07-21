document.addEventListener('DOMContentLoaded', function () {
    const profileCard = document.querySelector('.profile-card');

    profileCard.addEventListener('mouseover', () => {
        profileCard.style.transform = 'scale(1.05)';
        profileCard.style.transition = 'transform 0.3s';
    });

    profileCard.addEventListener('mouseout', () => {
        profileCard.style.transform = 'scale(1)';
    });

    anime({
        targets: '.profile-name',
        translateY: [-20, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: 500
    });

    fetch('/api/repos')
        .then(response => response.json())
        .then(data => {
            const projectList = document.querySelector('.project-list');

            data.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                projectItem.innerHTML = `
                    <h3>${project.name}</h3>
                    <a href="${project.html_url}" class="project-link" target="_blank">Ver proyecto</a>
                `;

                // Fetch languages for each project
                fetch(`/api/repos/${project.name}/languages`)
                    .then(response => response.json())
                    .then(languages => {
                        const languageBar = document.createElement('div');
                        languageBar.className = 'language-bar';

                        const languageList = Object.entries(languages);
                        const totalBytes = languageList.reduce((total, [, bytes]) => total + bytes, 0);

                        languageList.forEach(([language, bytes]) => {
                            const percentage = ((bytes / totalBytes) * 100).toFixed(2);
                            const languageDiv = document.createElement('div');
                            languageDiv.className = `bar ${language.toLowerCase()}`;
                            languageDiv.style.width = `${percentage}%`;
                            languageDiv.textContent = `${language}`;

                            languageBar.appendChild(languageDiv);
                        });

                        projectItem.appendChild(languageBar);
                    });

                projectList.appendChild(projectItem);
            });
        })
        .catch(error => {
            console.error("Error fetching repos:", error);
            const projectList = document.querySelector('.project-list');
            projectList.innerHTML = "<p>No se pudieron cargar los proyectos.</p>";
        });
});