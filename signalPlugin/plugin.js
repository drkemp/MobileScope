// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var _data = [];
var _timestamps = [];
var _deltaT = 0;
var _type = 'PERIODIC'; 
var _unitLable = 'units';
var _controlValues = { timeslice : 0.001, waveform: 'Sine'};

var _controls = { 
    definitions : { 
      timeslice : { datatype : 'float', label: 'Time Slice', units : 'seconds', value : 0.001, defaultvalue : 0.001, readonly : false}, 
      waveform : { datatype : 'select', label: 'Waveform', choices: ['Sine','Triangle','Square'], value : 'Sine', defaultValue : 'Sine', readonly: false}
    }
}

exports.init = function () {

}

exports.data = _data;
exports.timeStamps = _timestamps;
exports.deltaT = _deltaT;
exports.bufferType = _type;
exports.units = _unitLable;

exports.onReset = new Event('onReset');
exports.onUpdate = new Event('onUpdate');

exports.getControls = function(){
   return _controls;
}

exports.setControls = function(key, value) {
  if(_controls.hasOwnProperty(key)) {
    if(isValidData(_controls[key].datatype,value)) {
      _controlValues[key].value = value;
    }
  }  
}

isValidData(datatype, value) {
  return true;
}

