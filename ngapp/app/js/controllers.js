'use strict';

/* Controllers */

/* jshint jquery: true, browser: true, globalstrict: true */
/* global signalPlugin, angular */



var mscopeApp = angular.module('mscopeApp', []);

mscopeApp.controller('MScopeCtrl', function ($scope) {
    var theTimer;

    $scope.isPlaying = false;
    $scope.ymin =0;
    $scope.ymax = 300;
    $scope.trange = 1.0;
    $scope.show_cursors = true;
    $scope.tcursor1 = -0.4;
    $scope.tcursor2 = -0.45;

    var opts = $scope.signalOptions = {};
    opts.waveform = "Sine";
    opts.timeslice = 0.001;
    opts.mode = "Wave";

    opts = $scope.audioOptions = {};
    opts.timeslice = 0.001;
    opts.channel = "Left";
    opts.gain = 1;




    var src = $scope.datasource = new signalPlugin('signals');
    src.init();
    src.setControls({
        mode: 'Stream'
    });

    // plot settings for flot lib
    $scope.settings = {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {},
        xaxis: {}
    };

    redrawPlot();

    // Update only the data without redrawing axes.
    function updatePlot() {
        var dt = Number($scope.datasource.deltaT);
        var plot = $scope.plot;
        var plotData = prepData($scope.trange);
        plot.setData([plotData]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
    }

    // Get new data and massage it properly to be fed to flot.plot.
    function prepData(trange) {
        var buffer = $scope.datasource.getData();
        var t, v;
        var dt = Number($scope.datasource.deltaT);
        var len = Math.ceil(trange / dt);
        var dlen = buffer.data.length;
        if (len > dlen) {
            len = dlen;
        }

        var plotData = [];

        for (var i = 0; i < len; i++) {
            t = -dt * i;
            v = buffer.data[dlen - 1 - i];
            //t = buffer.time[dlen-1-i];
            //plotData.push([t, v]);
            plotData.push([t, v]);
        }
        return plotData;
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

        $scope.datasource.setControls($scope.signalOptions);
        var plotData = prepData($scope.trange);


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
            theTimer = setInterval(updatePlot, 50);
            $scope.isPlaying = true;
        }
    }


});