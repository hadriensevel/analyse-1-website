var board = JXG.JSXGraph.initBoard("BOX-jsx_derivee_intro", {
  boundingbox: [0, 1.1, 1, -0.5],
  grid: false,
  keepaspectratio: true,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
  drag: {enabled: false}
});

var axex = board.create('line', [[0,0],[1,0]], {
    strokeWeight:1,
    color: 'lightgray',
    fixed: true,
    opacity:0.5,
    highlight:false
  }
);

var axey = board.create('line', [[0,0],[0,1]], {
  strokeWeight:1,
  color: 'lightgray',
  fixed: true,
  opacity:0.5,
  highlight:false
});

// --------------------- //

var f = function (x) { return 0.5*x*x*x-0.5*x*x+0.2; };

var graph1 = board.create('functiongraph',
  [f, -10, 10],
  {name:'',
    withLabel:true,
    strokewidth:2,
    strokeColor: 'black',
    highlight:false
  }
);

var x0 = board.create("glider", [1.3,0,axex], {
  name: "\\[x_0\\]",
  size:2,
  color: 'blue',
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres après la virgule
  label:{offset:[-5,-8]}
});

var Ptg = board.create("glider", [
  function() {return x0.X()},
  function() {return f(x0.X())},graph1
], {
  name: "\\[f(x_0)\\]",
  size:1,
  fixed: false,
  color: 'black',
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres après la virgule
  label:{offset:[-30,15]}
});

var tgt= board.create('tangent',[Ptg], {
  color: 'lightblue',
  highlight:false
});

var segm0 = board.create('line',[x0,Ptg], {
  straightFirst:false,
  straightLast:false,
  strokeWidth:2,
  dash:1,
  highlight:false,
  color: "lightgray"});

// Sécante

//grid = board.create('grid', []);

var checkbox = board.create('checkbox', [1.75, -0.2, ' Voir la sécante'], {
  frozen: true,
  fontSize: 12, //default: 12
  label:{offset:[-50,+15]},
  cssClass:'../content.css'
});
checkbox.setPositionDirectly(JXG.COORDS_BY_SCREEN,[10,20]);

var x1 = board.create("glider", [1.5, 0, axex], {
  name: "\\[x\\]",
  size:2,
  color: 'red',
  highlight:false,
  showInfobox: false,
  //infoboxDigits: 2 // nombre de chiffres après la virgule
  visible: function() {return checkbox.Value();},
  label:{offset:[-3,0]},
});

var fx1=board.create("point",
  [function () { return x1.X(); },
    function () {return f(x1.X());}],
  {
    name: "\\[f(x)\\]",
    size:1,
    showInfobox: false,
    //fixed: true,
    label:{offset:[-30,35]},
    visible: function() {return checkbox.Value();},
    color: 'black'}
);

var x0moins=board.create("point",
  [function () { return x1.X(); },
    function () {return -0.15;}],
  {
    size:2,
    visible:false,
    color: 'black'}
);

var x0moins2=board.create("point",
  [function () { return x1.X(); },
    function () {return -0.3}],
  {
    size:2,
    visible:false,
    showInfobox: false,
    color: 'black'}
);


var x1prime=board.create("point",
  [function () { return x1.X();},
    function () {return Ptg.Y()}],
  {
    size:2,
    visible: false,
    showInfobox: false
  }
);

var fleche = board.create('arrow',[x0moins2,x0moins], {
  strokeColor: 'lightgray',
  visible: function() {return checkbox.Value();},
  fillColor: "white",
});


var segm1 = board.create('segment',[x1,fx1], {
  strokeWidth:2,
  dash:1,
  visible: function() {return checkbox.Value();},
  color: "lightgray",
  highlight:false
});

var segm2 = board.create('line',[Ptg,x1prime], {
  straightFirst:false,
  straightLast:false,
  strokeWidth:2,
  dash:1,
  visible: function() {return checkbox.Value();},
  color: "lightgray",
  highlight:false
});


var secante=board.create('line',[Ptg,fx1],{
  color: 'lightcoral',
  visible: function() {return checkbox.Value();}
});

var pentetangente = board.create('text',[
    1.6,0.2,
    function(){return "Pente de la tangente: "+tgt.getSlope().toFixed(4);}],
  {	color: 'lightblue',
    frozen: true
  });
pentetangente.setPositionDirectly(JXG.COORDS_BY_SCREEN,[10,40]);

var pentesecante = board.create('text',[1.6,0.4,
  function() {return "Pente de la sécante: "+secante.getSlope().toFixed(4);}
], {
  color: 'lightcoral',
  visible: function() {return checkbox.Value();},
  label:{offset:[15,0], anchorY: 'bottom'},
  frozen: true
});
pentesecante.setPositionDirectly(JXG.COORDS_BY_SCREEN,[10,60]);
//
//
//var lafonction = board.create('text',[
//function () {return x0moins2.X();},
//function () {return x0moins2.Y();},
//function(){return 'drag me!';}
//], {color: 'lightgray',
//	visible: function() {return checkbox.Value();}
//});
