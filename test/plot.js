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
        max: 400
    },
    xaxis: {
        min: 0,
        show: true
    }
};


function updatePlot() {

    var dt = Number(datasource.deltaT);
    timestamps = _.range(0, dt * datasource.data.length, dt);
    var plotData = _.zip(timestamps, datasource.data);
    plot.setData([plotData]);
    // Since the axes don't change, we don't need to call plot.setupGrid()
    plot.draw();
}

function redrawPlot() {
    trange = Number($('#trange').val()) / 1000;
    ymin = Number($('#ymin').val());
    ymax = Number($('#ymax').val());
    console.log(ymax);
    settings.yaxis.min = ymin;
    settings.yaxis.max = ymax;
    settings.xaxis.min = -trange;
    settings.xaxis.max = 0;

    var t,v;
    var dt = Number(datasource.deltaT);
    var len = Math.ceil(trange / dt);
    var dlen = datasource.data.length;
    if (len > dlen) {
        len = dlen;
    }

    plotData = [];

    for (var i=0; i<len; i++) {
        t = -dt*i;
        v =  datasource.data[dlen-1-i];
        plotData.push([t, v]);
    }

    t1 = Number($('#tcursor1').val());
    t2 = Number($('#tcursor2').val());
    tcursor1 = [[t1, ymin],[t1, ymax]];
    tcursor2 = [[t2, ymin],[t2, ymax]];
    $('#tcursor_delta').text(t2-t1);
    if ($('#show_cursors').is(':checked')) {
        plotData = [
            plotData,
            tcursor1,
            tcursor2
        ];
    }
    plot = $.plot("#placeholder", plotData, settings);

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