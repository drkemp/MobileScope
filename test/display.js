
var timeToDraw=0;
function drawDisplay() {
  var start = Date.now();
  var data1 = datasource1.getData();
  var data2 = datasource2.getData();
  buildDisplay(data1,data2);
  timeToDraw = Date.now() - start;
}

var canvas = document.createElement('canvas');
canvas.height = 200;
canvas.width = 300;
document.getElementById('display').appendChild(canvas);

window.onload=function() {
  datasource1 = new audioPlugin('audio'); 
  datasource2 = new signalPlugin('signals');
  datasource1.init();
  datasource2.init();
  drawPluginControls(datasource1);
  drawPluginControls(datasource2);
  window.canvasTimer = setInterval(drawDisplay, 100);
}

function buildDisplay(data1, data2) {
  var ctx = canvas.getContext("2d");

  var color1 = 'rgb(0,0,0)';
  var color2 = 'rgb(100,100,0)';
  ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas

  drawwave(ctx, data1, color1);
  drawwave(ctx, data2, color2);

  ctx.font="10px Arial";
  ctx.strokeStyle = 'rgb(200,200,0)';
  ctx.strokeText("Draw Time:"+timeToDraw,200,15);
}
function drawwave(ctx, data,tracecolor) {
  var maxy=data.maxValue;
  var miny=data.minValue;
  var maxt=data.data.length;

  var linewidth=2;

  ctx.strokeStyle = tracecolor;
  ctx.lineWidth = linewidth;
  ctx.beginPath();
  for(var i=0; i<data.data.length; i++) {
      var x=canvas.width*(i+1)/maxt;
      var y=(canvas.height-1) * (data.data[i]-miny)/(maxy-miny);
      if(y<0) y=0;
      if(y>=canvas.height) y=canvas.height-1;
      if(i==0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

