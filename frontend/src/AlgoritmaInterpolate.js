
// const interpolate = require('interpolate');
import plotly from 'plotly.js-dist';

// Example scattered data points
const points = [
    { x: 0, y: 0, value: 1 },
    { x: 1, y: 0, value: 2 },
    { x: 0, y: 1, value: 3 },
    { x: 1, y: 1, value: 4 }
];

// Function to interpolate value at a specific point
function interpolate2D(points, x, y) {
    let totalWeight = 0;
    let interpolatedValue = 0;

    points.forEach(point => {
        const dx = x - point.x;
        const dy = y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
            interpolatedValue = point.value;
            totalWeight = 1;
            return;
        }

        const weight = 1 / distance;
        totalWeight += weight;
        interpolatedValue += weight * point.value;
    });

    if (totalWeight === 0) {
        throw new Error('Interpolation failed due to zero total weight.');
    }

    return interpolatedValue / totalWeight;
}

// Create a grid and interpolate values
const gridSize = 50;
const xRange = [0, 1];
const yRange = [0, 1];
const xStep = (xRange[1] - xRange[0]) / gridSize;
const yStep = (yRange[1] - yRange[0]) / gridSize;

let xValues = [];
let yValues = [];
let zValues = [];

for (let i = 0; i <= gridSize; i++) {
    xValues.push(xRange[0] + i * xStep);
    yValues.push(yRange[0] + i * yStep);
}

for (let i = 0; i <= gridSize; i++) {
    let zRow = [];
    for (let j = 0; j <= gridSize; j++) {
        const x = xRange[0] + i * xStep;
        const y = yRange[0] + j * yStep;
        zRow.push(interpolate2D(points, x, y));
    }
    zValues.push(zRow);
}

// Plot the data
const data = [{
    z: zValues,
    x: xValues,
    y: yValues,
    type: 'heatmap',
    colorscale: 'Viridis'
}];

const layout = {
    title: 'Interpolated Heatmap',
    xaxis: { title: 'X' },
    yaxis: { title: 'Y' }
};

const graphOptions = { layout, filename: "heatmap", fileopt: "overwrite" };

plotly.plot(data, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
});