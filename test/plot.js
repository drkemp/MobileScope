/* jshint jquery: true, browser: true */
/* global signalPlugin*/

var plot, datasource, trange;
var i = 0;
var theTimer;
var isPlaying = false;


window.onload = onLoad;
function onLoad() {
    datasource = new signalPlugin('signals');
    datasource.init();
    datasource.setControls({mode: 'Stream'});
    redrawPlot();
    //drawcontrols();

}

// plot settings for flot lib
var settings = {
    series: {
        shadowSize: 0 // Drawing is faster without shadows
    },
    yaxis: {},
    xaxis: {}
};

// Update only the data without redrawing axes.
function updatePlot() {
    var dt = Number(datasource.deltaT);
    var plotData = prepData(trange);
    plot.setData([plotData]);
    // Since the axes don't change, we don't need to call plot.setupGrid()
    plot.draw();
}

// Get new data and massage it properly to be fed to flot.plot.
function prepData(trange) {
    var buffer = datasource.getData();
    var t,v;
    var dt = Number(datasource.deltaT);
    var len = Math.ceil(trange / dt);
    var dlen = buffer.data.length;
    if (len > dlen) {
        len = dlen;
    }

    var plotData = [];

    for (var i=0; i<len; i++) {
        t = -dt*i;
        v = buffer.data[dlen-1-i];
        //t = buffer.time[dlen-1-i];
        //plotData.push([t, v]);
        plotData.push([t, v]);
    }
    return plotData;
}


// Redraw the entire plot with axes and cursors
function redrawPlot() {
    var lines;
    trange = Number($('#trange').val()) / 1000;
    var ymin = Number($('#ymin').val());
    var ymax = Number($('#ymax').val());

    settings.yaxis.min = ymin;
    settings.yaxis.max = ymax;
    settings.xaxis.min = -trange;
    settings.xaxis.max = 0;

    var plotData = prepData(trange);

    var t1 = Number($('#tcursor1').val());
    var t2 = Number($('#tcursor2').val());
    var tcursor1 = [[t1, ymin],[t1, ymax]];
    var tcursor2 = [[t2, ymin],[t2, ymax]];
    $('#tcursor_delta').text(t2-t1);
    if ($('#show_cursors').is(':checked')) {
        lines = [
            plotData,
            tcursor1,
            tcursor2
        ];
    } else {
        lines = [ plotData ];
    }
    plot = $.plot("#graph", lines, settings);
}

function playPause() {
    if(isPlaying) {
        clearInterval(theTimer);
        isPlaying = false;
        // Redraw the entire plot to show cursors.
        redrawPlot();
    } else {
        theTimer = setInterval(updatePlot, 50);
        isPlaying = true;
    }
}

function showPanel(panel) {
    var panels = ['trigger', 'cursors'];
    for (var i = 0; i<= panels.length; i++) {
        $('#' + panels[i] + '_panel').hide();
    }
    $('#' + panel + '_panel').show();
}
