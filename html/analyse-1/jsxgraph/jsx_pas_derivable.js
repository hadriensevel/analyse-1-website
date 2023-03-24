
JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard("BOX-jsx_pas_derivable", {
  boundingbox: [-1.5, 1.1, 1.5, -1.1],
  grid: false,
  keepaspectratio: false,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
//	zoom: {
//  factorX: 1.25,  // horizontal zoom factor (multiplied to JXG.Board#zoomX)
//  factorY: 1.25,  // vertical zoom factor (multiplied to JXG.Board#zoomY)
//  wheel: true,     // allow zooming by mouse wheel or
//  				   // by pinch-to-toom gesture on touch devices
//  needShift: true, // mouse wheel zooming needs pressing of the shift key
//  min: 0.001,        // minimal values of JXG.Board#zoomX and JXG.Board#zoomY, limits zoomOut
//  max: 1000.0,       // maximal values of JXG.Board#zoomX and JXG.Board#zoomY, limits zoomIn
//
//  pinchHorizontal: true, // Allow pinch-to-zoom to zoom only horizontal axis
//  pinchVertical: true,   // Allow pinch-to-zoom to zoom only vertical axis
//  pinchSensitivity: 7   // Sensitivity (in degrees) for recognizing horizontal or vertical pinch-to-zoom gestures.
//},
//	pan: {
//  enabled: true,   // Allow panning
//  needTwoFingers: false, // panning is done with two fingers on touch devices
//  needShift: true // mouse panning needs pressing of the shift key
//}
});
var axex = board.create('line', [[0,0],[1,0]], {
    strokeWeight:1,
    color: 'lightgray',
    fixed: true,
    opacity:0.5,
    highlight: false
  }
);

var axey = board.create('line', [[0,0],[0,1]], {
  strokeWeight:1,
  color: 'lightgray',
  fixed: true,
  opacity:0.5,
  highlight: false
});


var f = function (x) { return Math.sqrt(Math.abs(x))*Math.sin(1/x); };

var lafonction = board.create('text',[
  -1.5,
  0.7,
  function(){return '\\[f(x)=\\begin{cases}|x|^{1/2}\\sin(\\tfrac{1}{x})&\\text{ si }x\\neq 0\\\\0 &\\text{ si }x=0\\end{cases}\\]';}
]);

//test = board.create('text',[
//-1,
//function () {return board.getBoundingBox()[0];},
//'salut'
//]);
//var indications=board.create('text', );

var ia =board.create('glider', [-1,0,axex], {
  name: '\\[a\\]',
  size:1,
  color: 'gray',
  showInfobox: false,
  label:{offset:[-5,10]}
});
var ib =board.create('glider', [1,0,axex], {
  name: '\\[b\\]',
  size:1,
  color: 'gray',
  showInfobox: false,
  label:{offset:[-5,-10]}
} )

var fia=board.create('point', [
    function(){return ia.X()},
    function(){return f(ia.X())}
  ],
  {visible: false});
var fib=board.create('point', [
    function(){return ib.X()},
    function(){return f(ib.X())}
  ],
  {visible: false});

var sega = board.create('line',[ia,fia],
  {straightFirst:false, straightLast:false, strokeWidth:1, dash:1, color: 'lightgray'});
var segb = board.create('line',[ib,fib],
  {straightFirst:false, straightLast:false, strokeWidth:1, dash:1, color: 'lightgray'});

var x0 = board.create("glider", [0.7, 0, axex], {
  name: "\\[x\\]",
  size:2,
  color: '#234099',
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres après la virgule
  label:{offset:[-3,-12]}
});

var fx0=board.create("point",
  [function () { return x0.X(); },
    function () {return f(x0.X());}],
  {
    name: "\\[f(x)\\]",
    size:2,
    label:{offset:[-10,20]},
    color: 'black'}
);

var segm = board.create('line',[x0,fx0],
  {straightFirst:false, straightLast:false, strokeWidth:2, dash:1});

var graph1 = board.create('functiongraph',
  [f, function(){return ia.X()}, function(){return ib.X()}],
  {name:'',
    withLabel:true,
    strokewidth:2,
    strokeColor: 'black',
    highlight: false
  }
);
