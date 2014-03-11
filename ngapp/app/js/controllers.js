'use strict';

/* Controllers */

/* jshint jquery: true, browser: true, globalstrict: true */
/* global signalPlugin, angular */



var mscopeApp = angular.module('mscopeApp', []);

mscopeApp.controller('MScopeCtrl', function ($scope) {
    var theTimer;

    $scope.buffer = {};

    $scope.isPlaying = false;
    $scope.ymin =0;
    $scope.ymax = 300;
    $scope.tscale = 1000; // 1000 means ms 1e6 would mean us.
    $scope.trange = 1000;
    $scope.show_cursors = true;
    $scope.tcursor1 = -0.4;
    $scope.tcursor2 = -0.45;


    var opts = $scope.signalOptions = {};
    opts.waveform = "Sine";
    opts.timeslice = 0.001;
    opts.mode = "Stream";

    opts = $scope.audioOptions = {};
    opts.timeslice = 0.001;
    opts.channel = "Left";
    opts.gain = 1;

    // WATCHES
    $scope.$watch('signalOptions.waveform', updateControls);
    $scope.$watch('signalOptions.timeslice', updateControls);


    $scope.$watch('trange', redrawPlot);
    $scope.$watch('tcursor1', updatePlot);


    var src = $scope.datasource = new signalPlugin('signals');
    src.init();

    // plot settings for flot lib
    $scope.settings = {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {},
        xaxis: {}
    };

    // Init the plot
    updateControls();
    updateData();
    redrawPlot();

    ////////////////////////////////////// Functions /////////////////////////////////////////////////

    function updateData() {
        $scope.buffer = $scope.datasource.getData();
    }

    function updateControls() {
        $scope.datasource.setControls($scope.signalOptions);
        if( ! $scope.isPlaying ) {
            //redrawPlot();
        }
    }

    $scope.nextFrame = nextFrame;
    function nextFrame() {
        updateData();
        redrawPlot();
    }

    // Update only the data without redrawing axes.
    function updatePlot() {
        var dt = Number($scope.datasource.deltaT);
        var plot = $scope.plot;
        var lines = prepLines();
        plot.setData(lines);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
    }

    // Get new data and massage it properly to be fed to flot.plot.
    function prepData() {
        var t, v;
        var dt = Number($scope.datasource.deltaT);
        var len = Math.ceil($scope.trange / (dt * $scope.tscale ));
        var dlen = $scope.buffer.data.length;
        if (len > dlen) {
            len = dlen;
        }

        var plotData = [];

        for (var i = 0; i < len; i++) {
            t = -dt * i * $scope.tscale;
            v = $scope.buffer.data[dlen - 1 - i];
            //t = $scope.buffer.time[dlen-1-i] * $scope.tscale;
            plotData.push([t, v]);
        }
        return plotData;
    }

    function prepLines() {
        var lines;
        var plotData = prepData();

        var tcursor1 = [[$scope.tcursor1, $scope.ymin], [$scope.tcursor1, $scope.ymax]];
        var tcursor2 = [[$scope.tcursor2, $scope.ymin], [$scope.tcursor2, $scope.ymax]];

        if ($scope.show_cursors) {
            lines = [
            plotData,
            tcursor1,
            tcursor2
            ];
        } else {
            lines = [plotData];
        }
        return lines;
    }

    // Redraw the entire plot with axes and cursors
    $scope.redrawPlot = redrawPlot;
    function redrawPlot() {
        var lines;

        var settings = $scope.settings;
        settings.yaxis.min = $scope.ymin;
        settings.yaxis.max = $scope.ymax;
        settings.xaxis.min = -$scope.trange;
        settings.xaxis.max = 0;

        //$scope.datasource.setControls($scope.signalOptions);

        lines = prepLines();
        $scope.plot = $.plot("#graph", lines, settings);
    }

    $scope.playPause = playPause;
    function playPause() {
        if ($scope.isPlaying) {
            clearInterval(theTimer);
            $scope.isPlaying = false;
            // Redraw the entire plot to show cursors.
            redrawPlot();
        } else {
            theTimer = setInterval(nextFrame, 50);
            $scope.isPlaying = true;
        }
    }

    $scope.changeTrange = changeTrange;
    function changeTrange(direction) {
        var trange = $scope.trange;
        if (direction > 0) trange *= 2;
        else trange /= 2;

        var zeros = Math.floor(Math.log(trange) / Math.LN10 * 1.001);
        var scale = Math.pow(10, zeros);
        var msd = trange / scale;
        if (msd < 1.5 ) msd = 1;
        else if (msd <=3) msd =2;
        else msd = 5;
        $scope.trange = msd*scale;
    }


});