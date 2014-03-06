// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function drawPluginControls(plugin) {
  ctrls = plugin.getControls();
  for(key in ctrls) {
    if(ctrls.hasOwnProperty(key)) {
      if(ctrls[key].datatype=='select') makePluginSelect(key, ctrls[key]);
      else if(ctrls[key].datatype=='float') makePluginAdjustFloat(key, ctrls[key]);
      else if(ctrls[key].datatype=='int') makePluginAdjustInt(key, ctrls[key]);
    }
  }
}

function makePluginSelect(key,ctrl) {
  var selectid='sel_'+key;
  var picker=document.createElement('select');
  picker.className="controls";
  picker.id = selectid;
  for(var opt in ctrl.choices){
     var optel = document.createElement('option');
     optel.text=ctrl.choices[opt];
     picker.add(optel);
  }
  picker.onchange = function() {
    var setting={};
    var pick = document.getElementById(selectid);
    setting[key]=pick.options[pick.selectedIndex].text;
    datasource.setControls(setting);
  }
  document.getElementById('knobs.time').appendChild(picker);
}

function makePluginAdjustFloat(key,ctrl) {

}

function makePluginAdjustInt(key,ctrl) {

}

