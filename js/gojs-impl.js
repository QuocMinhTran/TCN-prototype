/* global go */
/* exported initRenderer, clearRenderer, templateRenderer, fillRenderer */
var myDiagram;
var $go;

function initRenderer() {
	$go = go.GraphObject.make;
	var $ = $go;
	myDiagram = $(go.Diagram,"myDiagramDiv",
		{
			grid: $(go.Panel,"Grid",
                    $(go.Shape,"LineH",{stroke:"lightgray",strokeWidth:0.5}),
                    $(go.Shape,"LineH",{stroke:"gray",strokeWidth:0.5,interval:10}),
                    $(go.Shape,"LineV",{stroke:"lightgray",strokeWidth:0.5}),
                    $(go.Shape,"LineV",{stroke:"gray",strokeWidth:0.5, interval:10})),
			initialContentAlignment: go.Spot.Center,
			"undoManager.isEnabled":true,
			allowDrop:true,
			"draggingTool.dragsLink":true,
			"draggingTool.isGridSnapEnabled":true,
			"linkingTool.isUnconnectedLinkValid":true,
			"linkingTool.portGravity":20,
			"relinkingTool.isUnconnectedLinkValid":true,
			"relinkingTool.portGravity":20,
			"relinkingTool.fromHandleArchetype":
                    $(go.Shape,"Diamond",{segmentIndex:0,cursor:"pointer", desiredSize: new go.Size(8,8), fill: "tomato", stroke:"red"}),
			"relinkingTool.toHandleArchetype":
                    $(go.Shape,"Diamond",{segmentIndex:-1,cursor:"pointer", desiredSize: new go.Size(8,8), fill:"red", stroke: "tomato"}),
			"linkReshapingTool.handleArchetype":
                    $(go.Shape,"Diamond",{desiredSize: new go.Size(7,7), fill: "lightblue", stroke: "deepskyblue"})
		});
}

function clearRenderer() {
	myDiagram.clear();
}

function templateRenderer() {
	var $ = $go;
	myDiagram.nodeTemplate = 
        $(go.Node,"Auto",
	{
            //background:"#44CCFF",
		locationSpot: go.Spot.Center,
		locationObjectName:"SHAPE",
		resizable:true, resizeObjectName:"SHAPE",
		rotatable:true, rotateObjectName:"SHAPE"
	},
        $(go.Shape, 
	{ 
		figure: "Rectangle",
		name:"SHAPE",
		fill: "lightgray",
		stroke: null, strokeWidth: 0,
		stretch: go.GraphObject.Fill,
		alignment: go.Spot.Center ,
		width:100,
		height:100
	},
        new go.Binding("figure","shape"),
        new go.Binding("fill", "color")),
        $(go.Picture,
            new go.Binding("source")
        ),
        $(go.TextBlock,
        "Default Text",
	{
		margin: 10, 
		stroke:"black", 
		font: "bold 16px sans-serif",
		textAlign:"center"
	},
        new go.Binding("text","name"))
    );
}

function fillRenderer(input) {
	myDiagram.model = new go.TreeModel(nodeGenerator(input));
}

function nodeGenerator(data){
	if(data) {
		var nodeDataArray = [], obj;
		for(obj in data.Network.Hosts.Host) {
			nodeDataArray.push({name:data.Network.Hosts.Host[obj]._name,color:"blue", shape:"Database"});
		}

		for(obj in data.Network.Switches.Switch) {
			nodeDataArray.push({name:data.Network.Switches.Switch[obj]._name,color:"white",shape:"Circle"});
		}

		return nodeDataArray;
	}
}

