// Edit Steg.

// Adding new Host or Switch
function addNewHost(){
	var _modelId = $("#Model").val();
	var _name = $("#deviceName").val();
	if(_name== ""){
		alert("Please enter the name of the device");
		return;
	}
	if(document.getElementById("radios-0").checked){
		let host = {
			EthernetPorts:{
				EthernetPort:{
					"_name":"Port1",
					"_speed": $("#speed").val()
				}
			},
			SoftwareComponents:{
				SoftwareComponent:[{
					"_executionTime":$("#stack").val()/1000000,
					"_name": "IP Stack"
				},
				{
					"_executionTime":$("#routing").val()/1000000,
					"_name":"Routing Module"
				}]
			},
			"_modelId":_modelId,
			"_name":_name
		};
		if(!("Hosts" in json.Network)){
			console.log("notdefined");
			json.Network.Hosts ={};
			json.Network.Hosts.Host = [];
		}		
		if($("#deviceTitle").html()==="New Device"){
			json.Network.Hosts.Host.push(host);
			var newHost = hostRenderer(_name);
			portRenderer(newHost,host.EthernetPorts.EthernetPort);	
		}else{
			var index = json.Network.Hosts.Host.findIndex(o => o._name === dName);
			if(json.Network.Hosts.Host[index]){
				json.Network.Hosts.Host[index]=host;
				console.log(app.canvas.getFigure(dName));
				app.canvas.getFigure(dName).id =_name;
				app.canvas.getFigure(_name).children.data[0].figure.text =_name;
				console.log(app.canvas.getFigure(_name));
			}else{
				json.Network.Hosts.Host.push(host);
			}
			closePanel();
		}	
	}else {
		var sumPort = $("#Ports option:selected").val();
		var EthernetPort=[];		
		for(var i =0;i<sumPort;i++){			
			EthernetPort.push({
				"_name":"Port"+(i+1),
				"_priority":$("#detailPort").children()[i].children[1].children[1].value,
				"_schedulingPolicy":$("#detailPort").children()[i].children[3].children[1].value,
				"_priorityMode":$("#detailPort").children()[i].children[2].children[1].value,
				"_speed":$("#detailPort").children()[i].children[0].children[1].value
			});
			console.log($("#detailPort").children()[i].children[0].children[1].value);
		}		
		var sw = {
			"EthernetPort":EthernetPort,
			"_modelId":_modelId,
			"_name":_name
		};	
		if(!("Switches" in json.Network)){
			json.Network.Switches ={};
			json.Network.Switches.Switch = [];
		}
		if($("#deviceTitle").html()==="New Device"){
			json.Network.Switches.Switch.push(sw);
			var newSw = switchRenderer(_name);
			portRenderer(newSw,sw.EthernetPort);
		}else{
			var index = json.Network.Switches.Switch.findIndex(o => o._name === dName);
			if(json.Network.Switches.Switch[index]){
				console.log(sumPort);
				var oldPort = json.Network.Switches.Switch[index].EthernetPort.length;
				if(json.Network.Switches.Switch[index].EthernetPort.length <= sumPort){
					json.Network.Switches.Switch[index]=sw;
					app.canvas.getFigure(dName).id =_name;
					app.canvas.getFigure(_name).children.data[0].figure.text =_name;
					for(var p =0;p< (sumPort-oldPort);p++){
						console.log(sumPort);
						var newPort = new DecoratedHybridPort();
						newPort.name = "Port"+(oldPort+p+1);
						newPort.children.data[0].figure.children.data[0].figure.text = newPort.name ;
						newPort.children.data[0].figure.children.data[1].figure.text = $("#detailPort").children()[oldPort+p].children[0].children[1].value/1000000 +" Mbit/s";
						newPort.children.data[0].figure.children.data[2].figure.text = "I Have a looooooooong name";
						if (p % 2 === 0) {
							app.canvas.getFigure(dName).addPort(newPort, new draw2d.layout.locator.OutputPortLocator);
							//console.log(newNode);				
						}
						else {				
							app.canvas.getFigure(dName).addPort(newPort, new draw2d.layout.locator.InputPortLocator);	
						}						
					}
				}else{
					alert("You must have equal or more than "+json.Network.Switches.Switch[index].EthernetPort.length + " ports.");
					return;
				}
			}else{
				json.Network.Switches.Switch.push(sw);
			}
			closePanel();
		}	
	}
	dName = "";
}

function addNewSensor(){
	if($("#sensorName").val()===""){
		alert("Please enter the name of the sensor");
		return;
	}	
	var speed = $("#speedInput").val()!=="" ? $("#speedInput").val()*$("#speedUnit").val() : 100000000;
	var sensor = {
		EthernetPort:{
			"_name": "Port1",
			"_speed":speed
		},
		_modelId:$("#sensorModel").val(),
		_name:$("#sensorName").val()
	};
	if(!("Sensors" in json.Network)){
		json.Network.Sensors ={};
		json.Network.Sensors.Sensor = [];
	}
	if($("#sensorTitle").html()==="New Sensor"){
		json.Network.Sensors.Sensor.push(sensor);
		var newSensor = sensorRenderer($("#sensorName").val());
		portRenderer(newSensor,sensor.EthernetPort);
	}else{
		var index = json.Network.Sensors.Sensor.findIndex(o => o._name === sensor._name);
		if(json.Network.Sensors.Sensor[index]){
			json.Network.Sensors.Sensor[index]=sensor;
		}else{
			json.Network.Sensors.Sensor.push(sensor);
		}
		closePanel();
	}	
	
	
}
function appendOptions(text,select){
	var option = document.createElement("option");
	option.text = text;
	option.value = text;
	select.appendChild(option);
}
var Path =[];
function dFPathInfo(){
	if($("#dFSource").val()){
		if($("#dFName").val() === ""){
			alert("Please choose a name for the data frame");
			return;
		}
		$("#dFSource").attr("disabled","disabled");
		if($("#dfPathDiv").hasClass("collapse")){
			$("#dfPathDiv").removeClass("collapse");
		}	
		//Save a single Path of Data frames
		if(document.getElementById("dfPath2").innerHTML=== ""){
			var count = document.getElementById("dfPath1").options.length;
			var nodes = {
				"Node":[],
				"_name":$("#dFName").val() +" - "+ $("#dfPath1 option:last-child").val()
			};
			for(var i =0;i<count;i++){
				var node={
					"_name":document.getElementById("dfPath1").options[i].value,
					"_sequenceNumber":i+1
				};
				nodes.Node.push(node);
			}		 
			Path.push(nodes);
			console.log(Path.length);
		}
		//reset panel	
		var dfPath1 = document.getElementById("dfPath1");
		dfPath1.innerHTML="";
		var dfPath2 =document.getElementById("dfPath2");
		dfPath2.innerHTML ="";
		if(json.Network.Hosts){
			var e = document.getElementById("dFSource");
			var eselected = e.options[e.selectedIndex].value;
			appendOptions(eselected,dfPath1);
			var list = relatedObject(eselected);
			for(var item of list){
				appendOptions(item, dfPath2);
			}
		}
	}
}
var stPath = [];
function stPathInfo(){
	if($("#streamSource").val()){
		if($("#streamName").val() === ""){
			alert("Please choose a name for the data frame");
			return;
		}
		$("#streamSource").attr("disabled","disabled");
		if($("#stPathDiv").hasClass("collapse")){
			$("#stPathDiv").removeClass("collapse");
		}	
		//Save a single Path of Data frames
		if(document.getElementById("dfPath2").innerHTML=== ""){
			var count = document.getElementById("dfPath1").options.length;
			var nodes = {
				"Node":[],
				"_name":$("#streamName").val() +" - "+ $("#dfPath1 option:last-child").val()
			};
			for(var i =0;i<count;i++){
				var node={
					"_name":document.getElementById("dfPath1").options[i].value,
					"_sequenceNumber":i+1
				};
				nodes.Node.push(node);
			}		 
			stPath.push(nodes);
			console.log(stPath.length);
		}
		//reset panel	
		var stPath1 = document.getElementById("dfPath1");
		stPath1.innerHTML="";
		var stPath2 =document.getElementById("dfPath2");
		stPath2.innerHTML ="";
		if(json.Network.Streams){
			var e = document.getElementById("streamSource");
			var eselected = e.options[e.selectedIndex].value;
			appendOptions(eselected,stPath1);
			var list = relatedObject(eselected);
			for(var item of list){
				appendOptions(item, stPath2);
			}
		}
	}
}
function relatedObject(name){
	var listName = [];
	if(json.Network.Links){
		for(var key of json.Network.Links.Link){
			if(splitString(key.EthernetPort[0]._name)[0] === name){
				listName.push(splitString(key.EthernetPort[1]._name)[0]);
			}else if(splitString(key.EthernetPort[1]._name)[0] ===name){
				listName.push(splitString(key.EthernetPort[0]._name)[0]);
			}			
		}
	}
	return listName;
}
function addPath(){
	var selected = document.getElementById("dfPath2").value;
	if(selected!== ""){
		var lastValue = document.getElementById("dfPath1").options[document.getElementById("dfPath1").options.length - 1].value;
		document.getElementById("dfPath2").innerHTML = "";
		appendOptions(selected, document.getElementById("dfPath1"));
		var list = relatedObject(selected);
		for(var item of list){
			if(item!== lastValue){
				appendOptions(item, document.getElementById("dfPath2"));
			}
		}
	}else(alert("You have to choose the next object"));
}
function removePath(){
	if(document.getElementById("dfPath1").options.length>1){
		var selected="";
		var lastValue=document.getElementById("dfPath1").options[document.getElementById("dfPath1").options.length - 2].value;
		if(document.getElementById("dfPath1").options.length>2){
			selected = document.getElementById("dfPath1").options[document.getElementById("dfPath1").options.length - 3].value;
			lastValue = document.getElementById("dfPath1").options[document.getElementById("dfPath1").options.length - 2].value;
		}
		document.getElementById("dfPath2").innerHTML = "";
		document.getElementById("dfPath1").removeChild(document.getElementById("dfPath1")[document.getElementById("dfPath1").options.length-1]);
		var list = relatedObject(lastValue);
		console.log(list);
		for(var item of list){
			if(item!== selected){
				appendOptions(item, document.getElementById("dfPath2"));
			}
		}
	}else(alert("Cannot remove anymore!!!"));
	
}
function addNewDF(){	
	if($("#dFSource").val()===null){
		alert("Please create objects before adding data frames");
		return;
	}
	if($("#dFName").val() === ""){
		alert("Please choose a name for the data frame");
		return;
	}
	if(!("DataFrames" in json.Network)){
		json.Network.DataFrames={};
		json.Network.DataFrames.DataFrame=[];
	}
	for(var key of json.Network.DataFrames.DataFrame){
		if(key._name === $("#dFName").val()){
			alert("plz assign another name");
			return ;
		}
	}
	dFPathInfo();
	var df = {
		"_bitSize": $("#dFSize").val(),
		"_name": $("#dFName").val(),
		"_offset": $("#dFOffset").val(),
		"_priority": $("#dFPriority").val(),
		"_source": $("#dFSource").val(),
		"Path":Path
	};
	json.Network.DataFrames.DataFrame.push(df);	
	console.log(json);
	Path = [];
	closePanel();	
}
function addNewStream(){
	if($("#streamSource").val()===null){
		alert("Please create sensor before adding stream");
		return;
	}
	if($("#streamName").val() === ""){
		alert("Please choose a name for the stream");
		return;
	}	
	for(var key of json.Network.Streams.Stream){
		if(key._name === $("#dFName").val()){
			alert("plz assign another name");
			return ;
		}
	}
	stPathInfo();
	var st = {		
		"_name": $("#streamName").val(),
		"_offset": $("#streamOffset").val(),		
		"_source": $("#streamSource").val(),
		"Path":stPath
	};
	json.Network.Streams.Stream.push(st);		
	stPath = [];
	closePanel();	
}
function addNewTimer(){
	if($("#timerFlow").val()===null){
		alert("Please create objects before adding data frames");
		return;
	}
	if($("#timerID").val() === ""){
		alert("Please choose a name for the data frame");
		return;
	}
	if(!("Timers" in json.Network)){
		json.Network.Timers={};
		json.Network.Timers.Timer=[];
	}
	var timer = {
		"TimeSampler":[],
		"_dataFrame":$("#timerFlow").val(),
		"_name":$("#timerID").val(),
		"_targetMacAddress":$("#timerMACAdress").val()
	};
	timer.TimeSampler.push({"_processor":$("#egressInterface").val()+".EI.Tx"},{"_processor":$("#ingressInterface").val()+".II.Rx"});
	json.Network.Timers.Timer.push(timer);
	console.log(json);
	closePanel();
}
function addNewVlan(){
	var vlanName = $("#vlanName");
	var vlanID = $("#vlanID");
	var vlanSource = $("#vlanSource").val();
	var vlanPriority = $("#vlanPriority");
	var vlanPath1 = $("#vlanPath1 option");
	if(vlanSource===null){
		alert("Please create Data frames before adding Vlans");
		return;
	}
	if(vlanID.val() === "" || vlanName.val() === ""){
		alert("Please fill in information for the Vlan");
		return;
	}
	if(!("Vlans" in json.Network)){
		json.Network.Vlans = {};
		json.Network.Vlans.Vlan = [];
	}
	var ethernetPort =[];
	if(vlanPath1.length !== 0){
		for(var index of vlanPath1){
			var v = {
				"_name":index.value,
				"_tagged": "true"
			};
			ethernetPort.push(v);
		}
	}
	var vlan = {
		"_name":vlanName.val(),
		"_priority":vlanPriority.val(),
		"_vlanId":vlanID.val(),
		"EthernetPort": ethernetPort
	};
	json.Network.Vlans.Vlan.push(vlan);
	for(var df of json.Network.DataFrames.DataFrame){
		if(df._name === vlanSource){
			df._vlanId = vlanID.val();
		}
	}
	console.log(vlan);
	closePanel();
	console.log(json);
}
function updateVlanChange(){
	var vlanPath1 = document.getElementById("vlanPath1");
	var vlanSource = document.getElementById("vlanSource").value;
	vlanPath1.innerHTML="";
	for(var flow of json.Network.DataFrames.DataFrame){		
		var vlanlist = [];
		if(flow._name === vlanSource){
			for(var i=0;i<flow.Path.length;i++){
				for(var j=0;j<flow.Path[i].Node.length-1;j++){					
					var list = relatedPort(flow.Path[i].Node[j]._name,flow.Path[i].Node[j+1]._name);					
					for(var index of list){
						if(!(vlanlist.includes(index))){
							appendOptions(index,vlanPath1);
							vlanlist.push(index);							
						}
					}
				}
			}
		}
	}
	sortSelectOptions("#vlanPath1");
}
function relatedPort(start,end){
	var listName = [];
	if(json.Network.Links){
		for(var key of json.Network.Links.Link){
			if((splitString(key.EthernetPort[0]._name)[0] === start && splitString(key.EthernetPort[1]._name)[0] === end)||
				splitString(key.EthernetPort[0]._name)[0] === end && splitString(key.EthernetPort[1]._name)[0] === start){
				listName.push(key.EthernetPort[0]._name);
				listName.push(key.EthernetPort[1]._name);
			}
		}
	}
	return listName;
}
function sortSelectOptions(selectElement) {
	var options = $(selectElement + " option");

	options.sort(function(a,b) {
		if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
		else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
		else return 0;
	});

	$(selectElement).empty().append( options );
}

	//Edit host, switch
var dName="";
function editDevice(figure,text){	
	console.log(figure.id);
	dName = figure.id;
	$("#infoPanel").html("");
	$("#infoPanel").html(deviceBody);
	$("#deviceTitle").html(text);
	$("#deviceName").val(dName);
	var chosenObj, index, obj;
	if(text=="Edit Switch"){
		$("input[id='radios-1']").attr("checked","checked");
		obj = json.Network.Switches.Switch;
		index = obj.findIndex(o => o._name === dName);
		if(obj[index]){
			chosenObj = obj[index];
		}
		radioOnChange();
		$("#Ports").val(chosenObj.EthernetPort.length);
		portOnChange();		
		for(var i = 0 ; i<chosenObj.EthernetPort.length;i++){
			$("#detailPort").children()[i].children[1].children[1].value = chosenObj.EthernetPort[i]._priority;
			$("#detailPort").children()[i].children[2].children[1].value = chosenObj.EthernetPort[i]._priorityMode;
			$("#detailPort").children()[i].children[3].children[1].value = chosenObj.EthernetPort[i]._schedulingPolicy;
			$("#detailPort").children()[i].children[0].children[1].value = chosenObj.EthernetPort[i]._speed;
		}
	}else{
		obj = json.Network.Hosts.Host;
		index = obj.findIndex(o => o._name === dName);
		if(obj[index]){
			chosenObj = obj[index];
		}		
		console.log(dName);
		console.log(chosenObj);
		console.log(chosenObj.SoftwareComponents.SoftwareComponent[1]._executionTime);
		console.log($("#detailPort"));
		$("#routing").val(chosenObj.SoftwareComponents.SoftwareComponent[1]._executionTime*1000000);
		$("#stack").val(chosenObj.SoftwareComponents.SoftwareComponent[0]._executionTime*1000000);
		$("#detailPort").children()[0].children[1].value = chosenObj.EthernetPorts.EthernetPort._speed;
	}	
	$("input[name='radios']").attr("disabled","disabled");

}

function editSensor(figure,text){
	$("#infoPanel").html("");
	$("#infoPanel").html(sensorBody);
	$("#sensorTitle").html(text);
	$("#sensorName").val(figure.id);
}