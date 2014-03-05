

function drawDisplay() {
  var start = Date.now();
  var data = getData();
  buildDisplay(data);
  var timetodraw = Date.now() - start;
  document.getElementById('Perf').innerHTML=":"+timetodraw;
}

window.canvasTimer = setInterval(drawDisplay, 1000);
  var canvas = document.createElement('canvas');
  canvas.height = 100;
  canvas.width = 300;
  document.getElementById('display').appendChild(canvas);

function buildDisplay(data) {
//  var canvas = document.createElement('canvas');
//  canvas.height = 100;
//  canvas.width = 300;
//  document.getElementById('display').appendChild(canvas);
  var ctx = canvas.getContext("2d");
    
  var maxy=-1000;
  var maxt=data.length;
  for(var i=0; i<data.length; i++) {
     if(data[i]>maxy) maxy=data[i];
  }

  var strokes=[[0,0,0],[200,0,0],[0,200,0],[0,0,200]];
  var r=0;g=0;b=0;indx=0;
  function newcolor(){
    indx++;
    if (indx>=strokes.length) indx=0;
    r=strokes[indx][0];
    b=strokes[indx][1];
    g=strokes[indx][2];
  }
//  function draw() {
    ctx.clearRect(0,0,300,100); // clear canvas
    var linewidth=2;

    ctx.save();
    ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    ctx.moveTo(0,0);
    for(var i=0; i<data.length; i++) {
      var x=300*(i+1)/maxt;
      var y=100*(data[i]+1)/maxy;
      ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.restore();
    newcolor();
//  }
}

