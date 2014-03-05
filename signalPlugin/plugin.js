// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function signalPlugin(name) {
  this.name = name;
  this.data = [];
  this.timestamps = [];
  this.deltaT = 0;
  this.bufferType = 'PERIODIC'; 
  this.unitLabel = 'units';
  this.bufferSize=1024;
  this.cycles =10;
  this.maxValue = 300;

  var pluginthis = this;

  this.controls = { 
      timeslice : { datatype : 'float', label: 'Time Slice', units : 'seconds', value : '0.001', defaultValue : '0.001', readonly : false}, 
      waveform : { datatype : 'select', label: 'Waveform', units : 'wavetype', choices: ['Sine','Triangle','Square','Unity'], value : 'Sine', defaultValue : 'Sine', readonly: false}
  }

  this.onReset = new Event('onReset');
  this.onUpdate = new Event('onUpdate');

  function scale( value, range) {
    return value*(pluginthis.maxValue/range);
  }

  function initBuffer() {
    pluginthis.deltaT = pluginthis.controls.timeslice.value;
    for(var i=0;i<pluginthis.bufferSize;i++) {
      var ctime = (pluginthis.bufferSize/pluginthis.cycles); // samples/ cycle
      var phi = (i % ctime)/ctime;
      var wavetype = pluginthis.controls.waveform.value;
      if(wavetype=='Sine') pluginthis.data[i] = scale( Math.sin(Math.PI*2*phi)+1, 2 );
      else if(wavetype=='Triangle') pluginthis.data[i] = scale(phi,1 );
      else if(wavetype=='Square') pluginthis.data[i] = scale( Math.round(phi),1 );
      else pluginthis.data[i] = pluginthis.maxValue/2;
    } 
  }

  this.getControls = function(){
    return pluginthis.controls;
  }

  this.init = function() {
    setDefaults();
    initBuffer();
  }

  this.setControls = function(valueDictionary) {
    var changed=false;
    for (var key in valueDictionary) {
      if (valueDictionary.hasOwnProperty(key)) {
        if(pluginthis.controls.hasOwnProperty(key)) {
          var value = valueDictionary[key];
          if(isValidData(pluginthis.controls[key].datatype, value)) {
            pluginthis.controls[key].value = valueConvert(pluginthis.controls[key].datatype, value);
            changed=true;
          }
        }  
      }
    }
    if(changed) {
      initBuffer();
//      if(pluginthis.onReset) onReset();
    }
  }
  function setDefaults() {
    for(key in pluginthis.controls) {
      if(pluginthis.controls.hasOwnProperty(key)) {
        pluginthis.controls[key].value = pluginthis.controls[key].defaultValue;
        console.log('setting '+ pluginthis.controls[key].value);
      }
    }
  }

  function valueConvert(datatype, value) {
    if(datatype=='int') return parseInt(value);
    else if(datatype=='float') return parseFloat(value);
    return value;
  }

  function isValidData(datatype, value) {
    if(datatype=='int') return !isNaN(value);
    else if(datatype=='float') return !isNaN(value);
    return true;
  }
}

