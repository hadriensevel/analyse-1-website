
JXG.Options.text.useMathJax = true;

var boardGSIN = JXG.JSXGraph.initBoard("BOX-jsx_fonctions_graphe_sinus", {
  boundingbox: [-4.5, 1.4, 4.5, -1.4],
  grid: false,
  keepaspectratio: true,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
});

var axexGSIN = boardGSIN.create('line', [[0,0],[1,0]], {
    strokeWeight:1,
    color: 'lightgray',
    fixed: true,
    opacity:0.5,
    highlight:false
  }
);

var axeyGSIN = boardGSIN.create('line', [[0,0],[0,1]], {
  strokeWeight:1,
  color: 'lightgray',
  fixed: true,
  opacity:0.5,
  highlight:false
});

var fGSIN = function (x) { return Math.sin(x); };

var x0GSIN = boardGSIN.create("glider", [2, 0, axexGSIN], {
  name: "\\[x\\]",
  size:2,
  color: 'blue',
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres aprÃ¨s la virgule
  label:{offset:[-6,-12]}
});


var fx0GSIN=boardGSIN.create("point",
  [function () { return x0GSIN.X(); },
    function () {return fGSIN(x0GSIN.X());}],
  {
    name: "",
    size:1,
    label:{offset:[-10,20]},
    color: 'black'}
);

var y0GSIN=boardGSIN.create("point",
  [0,function () {return fGSIN(x0GSIN.X());}],
  {
    name: '',
    visible: true,
    size: 1,
    label:{offset:[-10,20]},
    color: 'black'}
);


boardGSIN.create('segment',[x0GSIN,fx0GSIN], {dash:1, color:'lightgray'});
boardGSIN.create('segment',[fx0GSIN,y0GSIN], {dash:1, color:'lightgray'});

var graph1GSIN = boardGSIN.create('functiongraph', [fGSIN], {
    name:'',
    withLabel:true,
    strokewidth:2,
    strokeColor: 'black',
    highlight:false
  }
);


boardGSIN.create('text', [
  function() {
    var pos;
    const delta=0.5;
    if (x0GSIN.X()<0) {pos=delta} else {pos=-delta}
    return pos;
  },
  function() {return y0GSIN.Y()},
  function() {return '\\[\\sin(x)\\]'}
], {
  anchorX: 'middle'
});
var coulvalremGSIN='#87cefa';

boardGSIN.create('point', [Math.PI/2,0], {
  name: '\\[\\tfrac{\\pi}{2}\\]',
  size: 1,
  fixed: true,
  color: coulvalremGSIN,
  label: {offset: [-6,-15]}
});
boardGSIN.create('point', [-Math.PI/2,0], {
  name: '\\[-\\tfrac{\\pi}{2}\\]',
  size: 1,
  fixed: true,
  color: coulvalremGSIN,
  label: {offset: [-10,15]}
});
boardGSIN.create('point', [Math.PI,0], {
  name: '\\[\\pi\\]',
  size: 1,
  fixed: true,
  color: coulvalremGSIN,
  label: {offset: [-6,12]}
});
boardGSIN.create('point', [-Math.PI,0], {
  name: '\\[-\\pi\\]',
  size: 1,
  fixed: true,
  color: coulvalremGSIN,
  label: {offset: [-17,-12]}
})