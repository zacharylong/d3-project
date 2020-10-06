const data = [
    {width: 200, height: 100, fill: 'purple'}
];

const svg = d3.select('svg')

const rect = svg.select('rect')
    .data(data)
    .attr('width', 200)
    .attr('height', 100)
    .attr('fill', 'pink');

    console.log(rect)