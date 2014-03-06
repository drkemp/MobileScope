

function drawDisplay() {
  var start = Date.now();
  var data = datasource.getData().data;
  buildDisplay(data);
  var timetodraw = Date.now() - start;
  document.getElementById('Perf').innerHTML=":"+timetodraw;
}

var canvas = document.createElement('canvas');
canvas.height = 200;
canvas.width = 300;
document.getElementById('display').appendChild(canvas);

function drawcontrols() {
  ctrls = datasource.getControls();
  for(key in ctrls) {
    if(ctrls.hasOwnProperty(key)) {
      if(ctrls[key].datatype=='select') makeselector(key, ctrls[key]);
      else if(ctrls[key].datatype=='float') makeknobfloat(key, ctrls[key]);
      else if(ctrls[key].datatype=='int') makeknobintt(key, ctrls[key]);
    }
  }
}
function makeselector(key,ctrl) {
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
function makeknobfloat(key,ctrl) {

}
function makeknobint(key,ctrl) {

}

window.onload=function() {
  datasource = new signalPlugin('signals');
  datasource.init();
  drawcontrols();
  window.canvasTimer = setInterval(drawDisplay, 500);
}

function buildDisplay(data) {
  var ctx = canvas.getContext("2d");
  var r=0;g=0;b=0;
    
  var maxy=-1000;
  var maxt=data.length;
  for(var i=0; i<data.length; i++) {
     if(data[i]>maxy) maxy=data[i];
  }

  ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas
  var linewidth=2;

//  ctx.save();
  ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  ctx.lineWidth = linewidth;
  ctx.beginPath();
  for(var i=0; i<data.length; i++) {
      var x=canvas.width*(i+1)/maxt;
      var y=(canvas.height-1) * (data[i]+1)/maxy;
      if(y<0) y=0;
      if(y>=canvas.height) y=canvas.height-1;
      if(i==0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
  }
  ctx.stroke();
//  ctx.restore();
}

