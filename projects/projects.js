async function getProjects() {
    const response = await fetch('../lib/projects.json');
    const projects = await response.json();
    return projects;
}

const projects = await getProjects();
console.log(projects);