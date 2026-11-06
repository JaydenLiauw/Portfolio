let data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    datetime: new Date(row.datetime),
}));

console.log(data);
let commits = d3.groups(data, (d) => d.commit)
    .map(([commit, lines]) => ({
        id: commit,
        url: `https://github.com/JaydenLiauw/Portfolio/commit/${commit}`,
        datetime: lines[0].datetime,
        author: lines[0].author,
        hourFrac: lines[0].datetime.getHours()
            + lines[0].datetime.getMinutes() / 60,
        totalLines: lines.length,
    }));

console.log(commits);
const width = 1000;
const height = 600;

const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};

const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
};
const xScale = d3.scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([usableArea.left, usableArea.right]);

const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);
    const svg = d3.select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');
    createBrushSelector(svg);
    const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);

    const rScale = d3.scaleSqrt()
    .domain([minLines, maxLines])
    .range([2, 30]);
    
    const sortedCommits = d3.sort(commits, d => -d.totalLines);
    const dots = svg.append('g')
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .attr('fill', 'steelblue');

dots.append('title')
    .text(d => `Commit: ${d.id.slice(0, 7)}
Date: ${d.datetime.toLocaleDateString()}
Time: ${d.datetime.toLocaleTimeString()}
Lines of Code: ${d.totalLines}`);

dots.on('click', (event, d) => {
    window.open(d.url, '_blank', 'noopener,noreferrer');
});

dots.on('mouseenter', (event, commit) => {
    renderTooltipContent(commit);
    updateTooltipVisibility(true);
});

dots.on('mousemove', (event) => {
    updateTooltipPosition(event);
});

dots.on('mouseleave', () => {
    updateTooltipVisibility(false);
});
    
const xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat(d3.timeFormat('%b %d'));

svg.append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

const yAxis = d3.axisLeft(yScale);

svg.append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

svg.append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(
        d3.axisLeft(yScale)
            .tickSize(-usableArea.width)
            .tickFormat('')
    );
    const stats = [
    { label: 'Total Lines', value: data.length },
    { label: 'Total Commits', value: commits.length },
    { label: 'Total Files', value: new Set(data.map(d => d.file)).size },
    { label: 'Maximum Depth', value: d3.max(data, d => d.depth) },
    { label: 'Longest Line', value: d3.max(data, d => d.length) },
];

const statsContainer = d3.select('#stats');

stats.forEach(stat => {
    statsContainer.append('dt').text(stat.label);
    statsContainer.append('dd').text(stat.value);
});
svg.append('text')
    .attr('x', usableArea.left)
    .attr('y', usableArea.top - 5)
    .attr('text-anchor', 'start')
    .attr('font-size', '14px')
    .text('Time of Day');
    svg.append('text')
    .attr('x', usableArea.left + usableArea.width / 2)
    .attr('y', usableArea.bottom + 45)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text('Commit Date');
    function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
}
function renderTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');

    if (Object.keys(commit).length === 0) return;

    link.href = commit.url;
    link.textContent = commit.id;

    date.textContent = commit.datetime?.toLocaleString('en', {
        dateStyle: 'full',
    });

    const time = document.getElementById('commit-time');
    const lines = document.getElementById('commit-lines');

    time.textContent = commit.datetime.toLocaleTimeString();
    lines.textContent = commit.totalLines;
    const author = document.getElementById('commit-author');
author.textContent = commit.author;
}
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');

    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
}
function createBrushSelector(svg) {
    svg.call(
        d3.brush()
            .on('start brush end', brushed)
    );
}

function brushed(event) {
    const selection = event.selection;

    if (!selection) {
        return;
    }

    const [[x0, y0], [x1, y1]] = selection;

    const selectedCommits = commits.filter(commit => {
        const x = xScale(commit.datetime);
        const y = yScale(commit.hourFrac);

        return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    });

    console.log(selectedCommits);
}