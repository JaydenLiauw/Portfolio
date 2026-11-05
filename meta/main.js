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
    const dots = svg.append('g')
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => Math.sqrt(d.totalLines) * 2)
    .attr('fill', 'steelblue');
    
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