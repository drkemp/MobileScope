/* jshint jquery: true, browser: true */
var plot, datasource;
var i = 0;


function getRandomData() {
    return [[1, 1], [2, 4], [3.5, 2.5], [4, 1 + i]];
}

datasource = new signalPlugin('signals');

var updateInterval = 30;
var settings = {
    series: {
        shadowSize: 0 // Drawing is faster without shadows
    },
    yaxis: {
        min: 0,
        max: 500
    },
    xaxis: {
        min: 0,
        show: true
    }
};


function updatePlot() {

    var dt = Number(datasource.deltaT);
    timestamps = _.range(0, dt * datasource.data.length, dt);
    plotData = _.zip(timestamps, datasource.data);
    plot.setData([plotData]);

    // Since the axes don't change, we don't need to call plot.setupGrid()

    plot.draw();
    //setTimeout(update, updateInterval);
    i = (i + 1) % 4;
}


// On load
$(function () {
    datasource = new signalPlugin('signals');
    datasource.init();
    plot = $.plot("#placeholder", [[0,0], [1,0]], settings);
    updatePlot();
});