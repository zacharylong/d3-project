const dims = { height: 500, width: 100 };

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100)
    .attr('height', dims.height + 100)

const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');

// data strat
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);

const tree = d3.tree()
    .size([dims.width, dims.height]);

// create ordinal scale
const color = d3.scaleOrdinal(['#f4511e', '#e91e63', '#e53935', '#9c27b0']);

// update function
const update = (data) => {

    // remove current nodes
    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();  

    // update ordinal scale domain
    color.domain(data.map(item => item.department)); 

    // get updated root node data
    const rootNode = stratify(data);

    const treeData = tree(rootNode);

    //get node selection and join data
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants());

    // get link selection and join data
    const links = graph.selectAll('.link')
        .data(treeData.links());

    // enter new links
    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    
    // create enter node group
    const enterNodes = nodes.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // append rects to enter nodes
    enterNodes.append('rect')
    // apply ordinal scale to work out fill

        .attr('fill', d => color(d.data.department))
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => d.data.name.length * 20)
        .attr('transform', d => {
            var x = d.data.name.length * 10
            return `translate(${-x}, -25)`
        });

    // append name text
    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr(d => d.data.name)


};

// data and firebase hook up
var data = [];

db.collection('employees').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id};

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    });

    update(data);

});