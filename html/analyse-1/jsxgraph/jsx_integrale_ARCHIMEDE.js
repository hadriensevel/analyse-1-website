var boardARCH = JXG.JSXGraph.initBoard('BOX-jsx_integrale_ARCHIMEDE', {
    boundingbox: [-2.5, 1.5, 2.5, -0.5],
    keepaspectratio: true,
    showNavigation: true,
    showFullscreen: true,
    showCopyright: false,
    axis: false,
    showZoom: true,
});

var axexARCH= boardARCH.create( "line", [ [0, 0], [1, 0], ],{
    strokeWeight: 1,
    color: "gray",
    fixed: true,
    opacity: 0.5,
    highlightStrokeColor: "lightgray",
});

var axeyARCH = boardARCH.create( "line", [ [0, 0], [0, 1], ],{
    strokeWeight: 1,
    color: "gray",
    fixed: true,
    opacity: 0.5,
    highlightStrokeColor: "lightgray",
});

var fARCH = function(x){ return 1-x*x; }

var plotARCH = boardARCH.create('functiongraph',[fARCH,-1,1], {
    strokeColor:'black',
    strokeWidth: 2
});

var nbrecARCH = boardARCH.create('slider',[
    [-2.3,1.2],
    [-0.3,1.2],
    [0,8,100]],{
    snapWidth:1,
    withTicks: false,
    withLabel: false,
    size: 2,
    frozen: true
});

boardARCH.create('text',[-2.2,1,
    function(){ return 'N='+nbrecARCH.Value().toFixed(0);}
]);

var checkdarbouxsupARCH = boardARCH.create('checkbox', [-1.75, 0.6, '\\text{Darbouxsup}'], {});
var checkdarbouxinfARCH = boardARCH.create('checkbox', [-1.75, 0.4, '\\text{Darbouxinf}'], {});
var checkriemannARCH = boardARCH.create('checkbox', [-1.75, 0.2, '\\text{Riemann}'], {});

var darbouxsupARCH = boardARCH.create('riemannsum',[fARCH, function(){return nbrecARCH.Value();},
    'upper', -1,1], {
    fillColor:'lightblue',
    fillOpacity:0.5,
    strokeColor:'lightblue',
    visible: function(){return checkdarbouxsupARCH.Value();}
//	strokeWidth:'2px'
});
var darbouxinfARCH = boardARCH.create('riemannsum',[fARCH, function(){return nbrecARCH.Value();},
    'lower', -1,1], {
    fillColor:'red',
    fillOpacity:0.2,
    strokeColor:'red',
    visible: function(){return checkdarbouxinfARCH.Value();}
//	strokeWidth:'2px'
});
var riemannARCH = boardARCH.create('riemannsum',[fARCH, function(){return nbrecARCH.Value();},
    'random', -1,1], {
    fillColor:'lightgreen',
    fillOpacity:0.5,
    strokeColor:'lightgreen',
    visible: function(){return checkriemannARCH.Value();}
//	strokeWidth:'2px'
});

boardARCH.create('text',[1.2,1,
    function(){ return '\\overline{S}_{\\sigma^{(N)}}='+darbouxsupARCH.Value().toFixed(4);}
]);
boardARCH.create('text',[1.2,0.7,
    function(){ return '\\underline{S}_{\\sigma^{(N)}}='+darbouxinfARCH.Value().toFixed(4);}
]);
