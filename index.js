async function getProjects() {
    const response = await fetch('./lib/projects.json');
    const projects = await response.json();
    return projects;
}

const projects = await getProjects();

const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

latestProjects.forEach(project => {
    const article = document.createElement('article');

    article.innerHTML = `
        <h2>${project.title}</h2>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
    `;

    projectsContainer.appendChild(article);
});