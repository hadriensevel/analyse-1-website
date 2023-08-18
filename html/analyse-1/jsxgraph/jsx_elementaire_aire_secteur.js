
JXG.Options.text.useMathJax = true;

var boardAIRES = JXG.JSXGraph.initBoard("BOX-jsx_elementaire_aire_secteur", {
  boundingbox: [-0.2, 0.6, 1.2, -0.12],
  grid: false,
  keepaspectratio: true,
  showNavigation: false,
  showFullscreen: true,
  showCopyright:false,
  axis: false,
  showZoom: true,
});

var P_AIRES=boardAIRES.create('point', [0.9,-0.1],{
  name: '',
  color: 'gray',
  size: 1
});
var Q_AIRES=boardAIRES.create('point', [0,0],{
  name: '',
  color: 'gray',
  size: 1
});


var R_AIRES=boardAIRES.create('point', [0.19,0.17],{
  name: '',
  color: 'lightblue',
  size: 1
});

boardAIRES.create('text', [function() {return (P_AIRES.X()+Q_AIRES.X())/2},function() {return (P_AIRES.Y()+Q_AIRES.Y())/2}, function() {return '\\[r\\]'}],
  {
    anchorX: 'middle',
    anchorY: 'top',
  });

var arc_AIRES = boardAIRES.create('sector', [Q_AIRES,P_AIRES,R_AIRES], {
  fillColor: 'lightblue',
  strokeColor: 'lightgray'
});

var theta_AIRES = boardAIRES.create('angle', [P_AIRES,Q_AIRES,R_AIRES], {
  name: '\\[\\theta\\]',
  color: 'black',
  radius: 0.1,
  visible: true,
  type: 'sector',
  label: {color: 'black',offset: [0,0]}
});

//var axexAIRES = boardAIRES.create('line', [[0,0],[1,0]], {
//	strokeWeight:1,
//	color: 'lightgray',
//	fixed: true,
//	opacity:0.5,
//	highlightStrokeColor: 'lightgray'
//}
//);
//
//var axeyAIRES = boardAIRES.create('line', [[0,0],[0,1]], {
//	strokeWeight:1,
//	color: 'lightgray',
//	fixed: true,
//	opacity:0.5,
//	highlightStrokeColor: 'lightgray'
//});
//
//var cercleAIRES = boardAIRES.create('circle', [[0,0],[1,0]], {
//	strokeColor: 'lightgray',
//	fixed: true,
//});
//
//var P_AIRES=boardAIRES.create('glider',[.5,.5,cercleAIRES], {
//	name: "\\[P\\]",
//	label:{offset:[-8,15]},
//	color: 'black',
//	size: 1
//});
//
//
//var coulcosAIRES='#0047ab';
//var coulsinAIRES='#be4f62';
//var coultanAIRES='#177245';
//
//var Px_AIRES=boardAIRES.create('point', [function() {return P_AIRES.X()},0], {
//	color: coulcosAIRES,
//	visible: true,
//	name:'',
//	size: 1
//});
//var Py_AIRES=boardAIRES.create('point', [0,function() {return P_AIRES.Y()}], {
//	color: coulsinAIRES,
//	visible: true,
//	name:'',
//	size: 1
//});
//
//
//boardAIRES.create('segment', [[0,0],Px_AIRES], {
//	strokeColor: coulcosAIRES
//});
//boardAIRES.create('segment', [[0,0],Py_AIRES], {
//	strokeColor: coulsinAIRES
//});
//
//var lab_cos_AIRES=boardAIRES.create('text', [function() {return Px_AIRES.X()/2},0,function() {return '\\[\\cos(\\alpha)\\]';}], {
//	color: coulcosAIRES,
//	anchorX: 'middle',
//	anchorY: 'top',
//});
//var lab_sin_AIRES=boardAIRES.create('text', [0,function() {return Py_AIRES.Y()/2},function() {return '\\[\\sin(\\alpha)\\]';}], {
//	color: coulsinAIRES,
//	anchorX: 'right',
//	anchorY: 'middle',
//});
//
//var unzero_AIRES=boardAIRES.create('point',[1,0], {visible: false});
//var origine_AIRES=boardAIRES.create('point',[0,0], {visible: false});
//
//var alpha_AIRES = boardAIRES.create('angle', [unzero_AIRES,origine_AIRES,P_AIRES], {
//	name: '\\[\\alpha\\]',
//	color: 'black',
//	radius: 0.2,
//	visible: true,
//	type: 'sector',
//	label: {color: 'black',offset: [0,0]}
//});
//
//var Ptg_AIRES=boardAIRES.create('point',[1,function() {return Math.tan(alpha_AIRES.Value())}], {
//	name: '',
//	label:{offset:[-8,15]},
//	color: coultanAIRES,
//	size: 1
//});
//
//var lab_tan_AIRES=boardAIRES.create('text', [1,function() {return Ptg_AIRES.Y()/2},function() {return '\\[\\tan(\\alpha)\\]';}], {
//	color: coultanAIRES,
//	anchorX: 'left',
//	anchorY: 'middle',
//});
//
//boardAIRES.create('segment', [P_AIRES,[0,0]], {
//	strokeColor: 'gray',
//	dash: 1,
//});
//boardAIRES.create('segment', [P_AIRES,Py_AIRES], {
//	strokeColor: 'lightgray',
//	dash: 1,
//});
//boardAIRES.create('segment', [P_AIRES,Px_AIRES], {
//	strokeColor: 'lightgray',
//	dash: 1,
//});
//boardAIRES.create('segment', [Ptg_AIRES,[0,0]], {
//	strokeColor: 'lightgray',
//	dash: 1,
//});
//
//boardAIRES.create('segment', [[1,0],Ptg_AIRES], {
//	strokeColor: coultanAIRES
//});
//
//var fAIRES = function (x) { return 0.9-0.6*x*x+0.1*Math.cos(15*x); };
//
//var x0AIRES = boardAIRES.create("glider", [0.47, 0, axexAIRES], {
//	name: "\\[x\\]",
//	size:2,
//	color: 'blue',
//	showInfobox: false,
//	//infoboxDigits: 2 // nombre de chiffres aprÃ¨s la virgule
//	label:{offset:[-6,-12]}
//});
//
//
//var fx0AIRES=boardAIRES.create("point",
//	[function () { return x0AIRES.X(); },
// 	function () {return fAIRES(x0AIRES.X());}],
//{
//	name: "\\(f(x)\\)",
//	size:1,
//	label:{offset:[-10,20]},
//	color: 'black'}
//);
//
//var moinsx0AIRES=boardAIRES.create('point',[
//function() {return (-1)*x0AIRES.X()}, 0 ],{
//	name: "\\(-x\\)",
//	size:1,
//	label:{offset:[-8,-12]},
//	color: 'black'}
//);
//
//var moinsfx0AIRES=boardAIRES.create('point',[
//function(){return (-1)*x0AIRES.X()},
//function(){return fx0AIRES.Y()}
//],{
//	name: "\\(f(-x)\\)",
//	size:1,
//	label:{offset:[-28,20]},
//	color: 'black'}
//);
//
//boardAIRES.create('segment',[x0AIRES,fx0AIRES], {dash:1, color:'lightgray'});
//boardAIRES.create('segment',[moinsx0AIRES,moinsfx0AIRES], {dash:1, color:'lightgray'});
//boardAIRES.create('segment',[fx0AIRES,moinsfx0AIRES], {dash:1, color:'pink'});
//
//var graph1AIRES = boardAIRES.create('functiongraph', [fAIRES], {
//	name:'',
//	withLabel:true,
//	strokewidth:2,
//	strokeColor: 'black',
//}
//);