/* global vis */
/* exported initRenderer, clearRenderer, templateRenderer, fillRenderer */

var network;
var container;
var options;
function initRenderer() {
	container = document.getElementById("myDiagramDiv");
}

function clearRenderer() {
	if (network) {

		network.destroy();
		network = null;
	}
}

function templateRenderer() {
	options = {
		nodes: {
			shape: "dot",
			size: 30,
			font: {
				size: 32,
				color: "#000000"
			},
			borderWidth: 2
		},
		physics: {
			enabled: false,
			barnesHut: {
				gravitationalConstant: -13850,
				centralGravity: 0,
				springConstant: 0.13,
				damping: 0.01,
				avoidOverlap: 0.03
			},
			maxVelocity: 40,
			minVelocity: 0.75
		}
	};
}

function fillRenderer(data) {
	network = new vis.Network(container, dataGenerate(data), options);
}

function dataGenerate(data) {
	if (data) {
		var nodes = [];
		var i = 0, obj;
		for (obj in data.Network.Hosts.Host) {
			nodes.push({ id: i++, label: data.Network.Hosts.Host[obj]._name });
		}
		for(obj in data.Network.Switches.Switch){
			nodes.push({id: i++,label: data.Network.Switches.Switch[obj]._name});
		}
		var edges = new vis.DataSet();
		var dataset = {
			nodes: nodes,
			edges: edges
		};
		return dataset;
	}
}