
var timeToDraw=0;
function drawDisplay() {
  var start = Date.now();
  var data = datasource.getData().data;
  buildDisplay(data);
  timeToDraw = Date.now() - start;
//  document.getElementById('Perf').innerHTML=":"+timeToDraw;
}

var canvas = document.createElement('canvas');
canvas.height = 200;
canvas.width = 300;
document.getElementById('display').appendChild(canvas);

window.onload=function() {
  datasource = new signalPlugin('signals');
  datasource.init();
  drawPluginControls(datasource);
  window.canvasTimer = setInterval(drawDisplay, 100);
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
  ctx.font="10px Arial";
  ctx.strokeStyle = 'rgb(200,200,0)';
  ctx.strokeText("Draw Time:"+timeToDraw,200,15);
}

