'use strict';

/* Controllers */

/* jshint jquery: true, browser: true, globalstrict: true */
/* global signalPlugin, angular */



var mscopeApp = angular.module('mscopeApp', []);

mscopeApp.controller('MScopeCtrl', function ($scope) {
    var theTimer;

    $scope.buffer = {};

    $scope.isPlaying = false;
    $scope.tscale = 1000; // 1000 means ms 1e6 would mean us.
    $scope.trange = 1000;
    $scope.vrange = 500;
    $scope.voffset = 0;
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
    $scope.$watch('vrange', redrawPlot);
    $scope.$watch('voffset', redrawPlot);

    $scope.$watch('tcursor1', updatePlot);
    $scope.$watch('tcursor2', updatePlot);


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

        var ymin = $scope.voffset;
        var ymax = $scope.voffset + $scope.vrange;

        var tcursor1 = [[$scope.tcursor1, ymin], [$scope.tcursor1, ymax]];
        var tcursor2 = [[$scope.tcursor2, ymin], [$scope.tcursor2, ymax]];

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

        var ymin = $scope.voffset;
        var ymax = $scope.voffset + $scope.vrange;

        var settings = $scope.settings;
        settings.yaxis.min = ymin;
        settings.yaxis.max = ymax;
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
        $scope.trange = changeLogVal($scope.trange, direction);
    }

    // Move to next or prev value in the following series
    // ... 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50 .....
    // There must be a simpler way.
    $scope.changeLogVal = changeLogVal;
    function changeLogVal(valueName, direction) {
        var value = $scope[valueName];
        if (direction > 0) value *= 2;
        else value /= 2;

        var zeros = Math.floor(Math.log(value) / Math.LN10 * 1.001);
        var scale = Math.pow(10, zeros);
        var msd = value / scale;
        if (msd < 1.5 ) msd = 1;
        else if (msd <=3) msd = 2;
        else if (msd <= 7.5) msd = 5;
        else msd = 10;
        $scope[valueName] =  msd * scale;
    }

    $scope.changRelVal = changRelVal;
    function changRelVal(valueName, step, direction) {
        var value = $scope[valueName];
        var newValue = step * (Math.round(value/step) + direction);
        $scope[valueName] = newValue;
    }
});