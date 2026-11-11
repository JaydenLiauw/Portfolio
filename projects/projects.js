async function getProjects() {
    const response = await fetch('../lib/projects.json');
    const projects = await response.json();
    return projects;
}

const projects = await getProjects();
let selectedYear = null;
console.log(projects);
const projectsContainer = document.querySelector('.projects');

projects.forEach(project => {
    const article = document.createElement('article');

    article.innerHTML = `
    <h2>
        ${project.title === 'Bikewatching'
            ? `<a href="https://jaydenliauw.github.io/bikewatching/" target="_blank">${project.title}</a>`
            : project.title}
    </h2>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
`;

    projectsContainer.appendChild(article);
});
const rolledData = d3.rollups(
    projects,
    v => v.length,
    d => d.year
);
console.log(rolledData);
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

const pieGenerator = d3.pie().value(d => d[1]);

const arcData = pieGenerator(rolledData);

console.log(arcData);
const colors = d3.scaleOrdinal(d3.schemeTableau10);

const svg = d3.select('#projects-pie-plot')
    .attr('viewBox', '-50 -50 100 100');

svg.selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => colors(i))
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
    const year = d.data[0];

    selectedYear = selectedYear === year ? null : year;

   console.log('Selected year:', selectedYear);

svg.selectAll('path')
    .attr('opacity', d =>
        selectedYear === null || d.data[0] === selectedYear ? 1 : 0.3
    );

updateProjects();
});

const legend = d3.select('.legend');
legend.selectAll('li')
    .data(rolledData)
    .join('li')
    .html((d, i) => `
        <span style="background-color: ${colors(i)}"></span>
        ${d[0]} <em>(${d[1]} projects)</em>
    `);
    const searchBar = document.querySelector('.searchBar');

searchBar.addEventListener('input', () => {
    updateProjects();
});
function updateProjects() {
    const query = searchBar.value.toLowerCase();

    const filteredProjects = projects.filter((project) => {
        const values = Object.values(project).join(' ').toLowerCase();

        const matchesSearch = values.includes(query);
        const matchesYear = selectedYear === null ||
                            project.year === selectedYear;

        return matchesSearch && matchesYear;
    });

    projectsContainer.innerHTML = '';

    filteredProjects.forEach(project => {
        const article = document.createElement('article');

        article.innerHTML = `
            <h2>${project.title}</h2>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;

        projectsContainer.appendChild(article);
    });
}