
JXG.Options.text.useMathJax = true;

var boardGTAN = JXG.JSXGraph.initBoard("BOX-jsx_fonctions_graphe_tangente", {
  boundingbox: [-4.5, 3.4, 4.5, -3.4],
  grid: false,
  keepaspectratio: true,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
});

var axexGTAN = boardGTAN.create('line', [[0,0],[1,0]], {
    strokeWeight:1,
    color: 'lightgray',
    fixed: true,
    opacity:0.5,
    highlight: false
  }
);

var axeyGTAN = boardGTAN.create('line', [[0,0],[0,1]], {
  strokeWeight:1,
  color: 'lightgray',
  fixed: true,
  opacity:0.5,
  highlight: false
});

var fGTAN = function (x) { return Math.tan(x); };

var x0GTAN = boardGTAN.create("glider", [0.9, 0, axexGTAN], {
  name: "\\[x\\]",
  size:2,
  color: 'blue',
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres aprÃ¨s la virgule
  label:{offset:[-6,-12]}
});


var fx0GTAN=boardGTAN.create("point",
  [function () { return x0GTAN.X(); },
    function () {return fGTAN(x0GTAN.X());}],
  {
    name: "",
    size:1,
    label:{offset:[-10,20]},
    color: 'black'}
);

var y0GTAN=boardGTAN.create("point",
  [0,function () {return fGTAN(x0GTAN.X());}],
  {
    name: '',
    visible: true,
    size: 1,
    label:{offset:[-10,20]},
    color: 'black'}
);


boardGTAN.create('segment',[x0GTAN,fx0GTAN], {dash:1, color:'lightgray'});
boardGTAN.create('segment',[fx0GTAN,y0GTAN], {dash:1, color:'lightgray'});

var graph1GTAN = boardGTAN.create('functiongraph', [fGTAN], {
    name:'',
    withLabel:true,
    strokewidth:2,
    strokeColor: 'black',
    highlight: false
  }
);


boardGTAN.create('text', [
  function() {
    var pos;
    const delta=0.5;
    if (x0GTAN.X()<0) {pos=delta} else {pos=-delta}
    return pos;
  },
  function() {return y0GTAN.Y()},
  function() {return '\\[\\tan(x)\\]'}
], {
  anchorX: 'middle'
});
var coulvalremGTAN='#87cefa';

boardGTAN.create('point', [Math.PI/2,0], {
  name: '\\[\\tfrac{\\pi}{2}\\]',
  size: 1,
  fixed: true,
  color: coulvalremGTAN,
  label: {offset: [-6,-15]}
});
boardGTAN.create('point', [-Math.PI/2,0], {
  name: '\\[-\\tfrac{\\pi}{2}\\]',
  size: 1,
  fixed: true,
  color: coulvalremGTAN,
  label: {offset: [-10,15]}
});
boardGTAN.create('point', [Math.PI,0], {
  name: '\\[\\pi\\]',
  size: 1,
  fixed: true,
  color: coulvalremGTAN,
  label: {offset: [-6,12]}
});
boardGTAN.create('point', [-Math.PI,0], {
  name: '\\[-\\pi\\]',
  size: 1,
  fixed: true,
  color: coulvalremGTAN,
  label: {offset: [-17,-12]}
});
boardGTAN.create('line', [[Math.PI/2,0],[Math.PI/2,1]],{color: 'lightblue', dash:2});
boardGTAN.create('line', [[-Math.PI/2,0],[-Math.PI/2,1]],{color: 'lightblue', dash:2});
boardGTAN.create('line', [[3*Math.PI/2,0],[3*Math.PI/2,1]],{color: 'lightblue', dash:2});
boardGTAN.create('line', [[-3*Math.PI/2,0],[-3*Math.PI/2,1]],{color: 'lightblue', dash:2});
