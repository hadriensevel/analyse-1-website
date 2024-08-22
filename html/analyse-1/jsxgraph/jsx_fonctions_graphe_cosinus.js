JXG.Options.text.useMathJax = true;

var boardGCOS = JXG.JSXGraph.initBoard("BOX-jsx_fonctions_graphe_cosinus", {
  boundingbox: [-4.5, 1.4, 4.5, -1.4],
  grid: false,
  keepaspectratio: true,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
});

var axexGCOS = boardGCOS.create('line', [[0,0],[1,0]], {
    strokeWeight:1,
    color: 'lightgray',
    fixed: true,
    opacity:0.5,
    highlight:false
  }
);

var axeyGCOS = boardGCOS.create('line', [[0,0],[0,1]], {
  strokeWeight:1,
  color: 'lightgray',
  fixed: true,
  opacity:0.5,
  highlight:false
});

var fGCOS = function (x) { return Math.cos(x); };

var x0GCOS = boardGCOS.create("glider", [2, 0, axexGCOS], {
  name: "\\[x\\]",
  size:2,
  color: 'blue',
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres aprÃ¨s la virgule
  label:{offset:[-6,-12]}
});


var fx0GCOS=boardGCOS.create("point",
  [function () { return x0GCOS.X(); },
    function () {return fGCOS(x0GCOS.X());}],
  {
    name: "",
    size:1,
    label:{offset:[-10,20]},
    color: 'black'}
);

var y0GCOS=boardGCOS.create("point",
  [0,function () {return fGCOS(x0GCOS.X());}],
  {
    name: '',
    visible: true,
    size: 1,
    label:{offset:[-10,20]},
    color: 'black'}
);


boardGCOS.create('segment',[x0GCOS,fx0GCOS], {dash:1, color:'lightgray'});
boardGCOS.create('segment',[fx0GCOS,y0GCOS], {dash:1, color:'lightgray'});

var graph1GCOS = boardGCOS.create('functiongraph', [fGCOS], {
    name:'',
    withLabel:true,
    strokewidth:2,
    strokeColor: 'black',
    highlight: false
  }
);


boardGCOS.create('text', [
  function() {
    var pos;
    const delta=0.5;
    if (x0GCOS.X()<0) {pos=delta} else {pos=-delta}
    return pos;
  },
  function() {return y0GCOS.Y()},
  function() {return '\\[\\cos(x)\\]'}
], {
  anchorX: 'middle'
});

var coulvalremGCOS='#87cefa';

boardGCOS.create('point', [Math.PI/2,0], {
  name: '\\[\\tfrac{\\pi}{2}\\]',
  size: 1,
  fixed: true,
  color: coulvalremGCOS,
  label: {offset: [-6,-15]}
});
boardGCOS.create('point', [-Math.PI/2,0], {
  name: '\\[-\\tfrac{\\pi}{2}\\]',
  size: 1,
  fixed: true,
  color: coulvalremGCOS,
  label: {offset: [-19,15]}
});
boardGCOS.create('point', [Math.PI,0], {
  name: '\\[\\pi\\]',
  size: 1,
  fixed: true,
  color: coulvalremGCOS,
  label: {offset: [-6,12]}
});
boardGCOS.create('point', [-Math.PI,0], {
  name: '\\[-\\pi\\]',
  size: 1,
  fixed: true,
  color: coulvalremGCOS,
  label: {offset: [-17,-12]}
})
