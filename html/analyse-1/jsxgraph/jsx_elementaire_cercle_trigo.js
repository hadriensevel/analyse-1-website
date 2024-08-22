
// import ...FROM ...

JXG.Options.text.useMathJax = true;

var boardELCT = JXG.JSXGraph.initBoard("BOX-jsx_elementaire_cercle_trigo", {
  boundingbox: [-1.2, 1.5, 1.2, -1.5],
  grid: false,
  keepaspectratio: true,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
});

var axexELCT = boardELCT.create('line', [[0,0],[1,0]], {
    strokeWeight:1,
    color: 'lightgray',
    fixed: true,
    opacity:0.5,
    highlightStrokeColor: 'lightgray'
  }
);

var axeyELCT = boardELCT.create('line', [[0,0],[0,1]], {
  strokeWeight:1,
  color: 'lightgray',
  fixed: true,
  opacity:0.5,
  highlightStrokeColor: 'lightgray'
});

var cercleELCT = boardELCT.create('circle', [[0,0],[1,0]], {
  strokeColor: 'lightgray',
  fixed: true,
});

var P_ELCT=boardELCT.create('glider',[.5,.5,cercleELCT], {
  name: "\\[P\\]",
  label:{offset:[-8,15]},
  color: 'black',
  size: 1
});


var coulcosELCT='#0047ab';
var coulsinELCT='#be4f62';
var coultanELCT='#177245';

var Px_ELCT=boardELCT.create('point', [function() {return P_ELCT.X()},0], {
  color: coulcosELCT,
  visible: true,
  name:'',
  size: 1
});
var Py_ELCT=boardELCT.create('point', [0,function() {return P_ELCT.Y()}], {
  color: coulsinELCT,
  visible: true,
  name:'',
  size: 1
});


boardELCT.create('segment', [[0,0],Px_ELCT], {
  strokeColor: coulcosELCT
});
boardELCT.create('segment', [[0,0],Py_ELCT], {
  strokeColor: coulsinELCT
});

var lab_cos_ELCT=boardELCT.create('text', [function() {return Px_ELCT.X()/2},0,function() {return '\\[\\cos(\\alpha)\\]';}], {
  color: coulcosELCT,
  anchorX: 'middle',
  anchorY: 'top',
});
var lab_sin_ELCT=boardELCT.create('text', [0,function() {return Py_ELCT.Y()/2},function() {return '\\[\\sin(\\alpha)\\]';}], {
  color: coulsinELCT,
  anchorX: 'right',
  anchorY: 'middle',
});

var unzero_ELCT=boardELCT.create('point',[1,0], {visible: false});
var origine_ELCT=boardELCT.create('point',[0,0], {visible: false});

var alpha_ELCT = boardELCT.create('angle', [unzero_ELCT,origine_ELCT,P_ELCT], {
  name: '\\[\\alpha\\]',
  color: 'black',
  radius: 0.2,
  visible: true,
  type: 'sector',
  label: {color: 'black',offset: [0,0]}
});

var Ptg_ELCT=boardELCT.create('point',[1,function() {return Math.tan(alpha_ELCT.Value())}], {
  name: '',
  label:{offset:[-8,15]},
  color: coultanELCT,
  size: 1
});

var lab_tan_ELCT=boardELCT.create('text', [1,function() {return Ptg_ELCT.Y()/2},function() {return '\\[\\tan(\\alpha)\\]';}], {
  color: coultanELCT,
  anchorX: 'left',
  anchorY: 'middle',
});

boardELCT.create('segment', [P_ELCT,[0,0]], {
  strokeColor: 'gray',
  dash: 1,
});
boardELCT.create('segment', [P_ELCT,Py_ELCT], {
  strokeColor: 'lightgray',
  dash: 1,
});
boardELCT.create('segment', [P_ELCT,Px_ELCT], {
  strokeColor: 'lightgray',
  dash: 1,
});
boardELCT.create('segment', [Ptg_ELCT,[0,0]], {
  strokeColor: 'lightgray',
  dash: 1,
});

boardELCT.create('segment', [[1,0],Ptg_ELCT], {
  strokeColor: coultanELCT
});

//var fELCT = function (x) { return 0.9-0.6*x*x+0.1*Math.cos(15*x); };
//
//var x0ELCT = boardELCT.create("glider", [0.47, 0, axexELCT], {
//	name: "\\[x\\]",
//	size:2,
//	color: 'blue',
//	showInfobox: false,
//	//infoboxDigits: 2 // nombre de chiffres aprÃ¨s la virgule
//	label:{offset:[-6,-12]}
//});
//
//
//var fx0ELCT=boardELCT.create("point",
//	[function () { return x0ELCT.X(); },
// 	function () {return fELCT(x0ELCT.X());}],
//{
//	name: "\\(f(x)\\)",
//	size:1,
//	label:{offset:[-10,20]},
//	color: 'black'}
//);
//
//var moinsx0ELCT=boardELCT.create('point',[
//function() {return (-1)*x0ELCT.X()}, 0 ],{
//	name: "\\(-x\\)",
//	size:1,
//	label:{offset:[-8,-12]},
//	color: 'black'}
//);
//
//var moinsfx0ELCT=boardELCT.create('point',[
//function(){return (-1)*x0ELCT.X()},
//function(){return fx0ELCT.Y()}
//],{
//	name: "\\(f(-x)\\)",
//	size:1,
//	label:{offset:[-28,20]},
//	color: 'black'}
//);
//
//boardELCT.create('segment',[x0ELCT,fx0ELCT], {dash:1, color:'lightgray'});
//boardELCT.create('segment',[moinsx0ELCT,moinsfx0ELCT], {dash:1, color:'lightgray'});
//boardELCT.create('segment',[fx0ELCT,moinsfx0ELCT], {dash:1, color:'pink'});
//
//var graph1ELCT = boardELCT.create('functiongraph', [fELCT], {
//	name:'',
//	withLabel:true,
//	strokewidth:2,
//	strokeColor: 'black',
//}
//);