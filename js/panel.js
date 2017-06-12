// defalut panel which shows after every database update

function deviceInPanel(hostsDiv, sw,type){	
	var div = document.createElement("DIV");
	div.className="outsideDiv";
	var divInside =document.createElement("BUTTON");
	var divText = document.createTextNode(type);
	divInside.className = "ulfirstline";
	divInside.appendChild(divText);
	var ul = document.createElement("UL");
	ul.className = "ul1";
	div.appendChild(divInside);
	div.appendChild(ul);	
	hostsDiv.appendChild(div);
	if(sw.length){
		for(var i of sw){	
			var li = document.createElement("LI");
			var liText = showHideButton(i._name);
			li.appendChild(liText);
			ul.appendChild(li);	
			var outsideDiv;					
			switch(type){
			case "Hosts":				
				outsideDiv = hostInfoPanel(i);
				/*outsideDiv.className = "ul1";
				liText.onclick = function(){showHide(outsideDiv);};*/
				break;
			case "Switches":
				outsideDiv = switchInfoPanel(i);				
				break;
			case "Sensors":
				outsideDiv = sensorInfoPanel(i);
				break;
			}	
			li.appendChild(outsideDiv);

		}
	}else{
		var li = document.createElement("LI");
		var liText = showHideButton(sw._name);
		li.appendChild(liText);
		ul.appendChild(li);
		var outsideDiv;					
		switch(type){
		case "Hosts":				
			outsideDiv = hostInfoPanel(sw);
				/*outsideDiv.className = "ul1";
				liText.onclick = function(){showHide(outsideDiv);};*/
			break;
		case "Switches":
			outsideDiv = switchInfoPanel(sw);				
			break;
		case "Sensors":
			outsideDiv = sensorInfoPanel(sw);
			break;
		}	
		li.appendChild(outsideDiv);
	}

	divInside.onclick = function(){showHide(ul);};	
}
function infoPanelRenderer(data){
	//create divice button and append it to infoPanel.
	var devices = document.createElement("BUTTON");
	devices.style.cssText = "width:100%;";
	devices.className = "btn btn-default";
	devices.innerHTML = "Devices";		
	$("#infoPanel").append(devices);

	//if there is any data, keep attaching more info of network
	if(data.Network){			
		// Create a div to put all devices in it.
		var hostsDiv = document.createElement("DIV");		
		hostsDiv.className = "hostsDiv-content";
		panelDivs.push(hostsDiv);
		$("#infoPanel").append(hostsDiv);
		if(data.Network.Hosts && data.Network.Hosts.Host.length!==0){
			// Generate hosts.
			var h = data.Network.Hosts.Host;			
			deviceInPanel(hostsDiv,h,"Hosts");
						
		}
		if(data.Network.Switches && data.Network.Switches.Switch.length!==0){
			// Generate switches.
			var sw = data.Network.Switches.Switch;			
			deviceInPanel(hostsDiv,sw,"Switches");			
		}
		
		if(data.Network.Sensors && data.Network.Sensors.Sensor.length!==0){
				// Generate sensors.
			var sen = data.Network.Sensors.Sensor;			
			deviceInPanel(hostsDiv,sen,"Sensors");
		}				
		devices.onclick = function(){
			hidePanel(hostsDiv);
			showHide(hostsDiv);
		};
			
	}

	// create link button
	var links = document.createElement("BUTTON");
	links.style.cssText = "width:100%";
	links.className = "btn btn-default";
	links.innerHTML = "Links";
	$("#infoPanel").append(links);

	var linksDiv = document.createElement("DIV");
	linksDiv.className = "hostsDiv-content";
	panelDivs.push(linksDiv);
	$("#infoPanel").append(linksDiv);
	//if there is any data, kepp attaching more info
	
	if(data.Network.Links && data.Network.Links.Link.length!==0){
		var l = data.Network.Links.Link;		
		linkInPanel(linksDiv,l,"Ethernet Links");
		links.onclick = function(){
			hidePanel(linksDiv);
			showHide(linksDiv);
		};
	}	

	//Generate Timers
	timerInPanel(data);

	//Generate Flows
	var flows = document.createElement("BUTTON");
	flows.style.cssText = "width:100%";
	flows.className = "btn btn-default";
	var flowsText = document.createTextNode("FLows");
	flows.appendChild(flowsText);
	$("#infoPanel").append(flows);	
	var flowDiv = document.createElement("DIV");
	flowDiv.className = "hostsDiv-content";	
	panelDivs.push(flowDiv);
	$("#infoPanel").append(flowDiv);
	
	//Data frames
	var dfButton =document.createElement("BUTTON");
	var dfButtonText = document.createTextNode("Data Frames");
	dfButton.append(dfButtonText);
	dfButton.className = "ulfirstline";
	flowDiv.appendChild(dfButton);
	var dfUl = document.createElement("UL");
	dfUl.className ="ul1";
	flowDiv.append(dfUl);
	flows.onclick  = function(){
		hidePanel(flowDiv);
		showHide(flowDiv);
	};
	
	if(data.Network.DataFrames && data.Network.DataFrames.DataFrame.length!==0){
		flowsInPanel(data.Network.DataFrames.DataFrame,dfUl);
		dfButton.onclick =function(){showHide(dfUl);};
	}


	//Stream
	var stButton =document.createElement("BUTTON");
	var stButtonText = document.createTextNode("Streams");
	stButton.append(stButtonText);
	stButton.className = "ulfirstline";
	flowDiv.appendChild(stButton);
	var stUl = document.createElement("UL");
	stUl.className ="ul1";
	flowDiv.append(stUl);	
	if(data.Network.Streams && data.Network.Streams.Stream.length!==0){
		flowsInPanel(data.Network.Streams.Stream,stUl);
		stButton.onclick =function(){showHide(stUl);};
	}

	//Generate VLANs
	var vlans = document.createElement("BUTTON");
	vlans.style.cssText = "width:100%";
	vlans.className = "btn btn-default";
	var vlansText = document.createTextNode("VLANs");
	vlans.appendChild(vlansText);
	$("#infoPanel").append(vlans);	
	var vlansDiv = document.createElement("DIV");
	vlansDiv.className = "hostsDiv-content";	
	panelDivs.push(vlansDiv);
	$("#infoPanel").append(vlansDiv);

	// VLAns
	var vlButton = document.createElement("BUTTON");
	var vlButtonText = document.createTextNode("VLans");
	vlButton.append(vlButtonText);
	vlButton.className = "ulfirstline";
	vlansDiv.appendChild(vlButton);
	var vlUl = document.createElement("UL");
	vlUl.className ="ul1";
	vlansDiv.append(vlUl);	
	vlans.onclick =function(){
		hidePanel(vlansDiv);
		showHide(vlansDiv);
	};
	if(data.Network.Vlans && data.Network.Vlans.Vlan.length!==0){
		vlansInPanel(data.Network.Vlans.Vlan,vlUl);
		vlButton.onclick =function(){showHide(vlUl);};
	}
}
function vlansInPanel(vl,ul){
	if(Array.isArray(vl)){
		for(var a of vl){
			var li = this.li(a._name);
			ul.append(li);
			var newUl = document.createElement("UL");
			li.append(newUl);
			for(var i in a){			
				if(i!=="EthernetPort" && i!=="_name"){
					var newLi = this.li(this.nameChange(i)+" :"+ a[i]);
					newUl.append(newLi);
				}else if(i==="EthernetPort"){
					var newLi = this.li("Tagged Ports:");
					newUl.append(newLi);
					var newUl1 = document.createElement("UL");
					newLi.append(newUl1);				
					for(var p of a[i]){									
						var newLi1 = this.li(p._name);
						newUl1.appendChild(newLi1);	
					}
				
				}
			}
		}
	}
}
function flowsInPanel(dt,ul){
	for(var a of dt){
		//console.log(a._name);
		var li = this.li(a._name);
		ul.append(li);
		var newUl = document.createElement("UL");
		li.append(newUl);
		for(var i in a){	
			//console.log("i: "+i);		
			if(i!=="Path" && i!=="_name"){
				var newLi = this.li(this.nameChange(i)+" :"+ a[i]);
				newUl.append(newLi);
			}else if(i==="Path"){				
				if(Array.isArray(a[i])){
					for(var p of a[i]){						
						var newLi = this.li("Path: "+ p._name);
						newUl.appendChild(newLi);
						var newUl1 = document.createElement("UL");
						newLi.append(newUl1);
						for(var n of p.Node){							
							var newLi1 = this.li(n._name);
							newUl1.append(newLi1);
						}
					}		
				}else{					
					var newLi = this.li("Path: "+ a[i]._name);
					newUl.appendChild(newLi);
					var newUl1 = document.createElement("UL");
					newLi.append(newUl1);
					for(var n of a[i].Node){							
						var newLi1 = this.li(n._name);
						newUl1.append(newLi1);
					}
				}
				
			}
		}
		
	}
}

function myFilter(){
	// Declare variables
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	ul = document.getElementById("myUL");
	li = ul.getElementsByTagName("li");

    // Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			li[i].style.cssText = "background-color:white";
		} 
	}
}
function timerInPanel(data){
	//create Timers button
	var timers = document.createElement("BUTTON");
	timers.style.cssText = "width:100%";
	timers.innerHTML = "Timers";
	timers.className = "btn btn-default";
	$("#infoPanel").append(timers);

	var timersDiv = document.createElement("DIV");
	timersDiv.className = "hostsDiv-content";
	panelDivs.push(timersDiv);
	$("#infoPanel").append(timersDiv);
	timers.onclick = function(){
		hidePanel(timersDiv);
		showHide(timersDiv);
	};
	if(("Timers" in data.Network ) && data.Network.Timers.Timer.length!=0){
		var t = data.Network.Timers.Timer;
		var timersTitle = document.createElement("BUTTON");
		timersTitle.innerHTML = "Timers";
		timersTitle.className = "ulfirstline";
		var ul =document.createElement("UL");
		ul.className = "ul1";
		timersDiv.append(timersTitle);
		timersDiv.append(ul);
		if(t.length){
			for(var a of t){				
				var li = document.createElement("LI");
				var liText = showHideButton(a._name);
				li.appendChild(liText);
				ul.appendChild(li);
				var middleUL = document.createElement("UL");
				var middleLi1 = this.li("Flow: "+a._dataFrame);
				var middleLi2 = this.li("Target MAC Address: "+(a._targetMacAddress!==""? a._targetMacAddress:"{Unspecified}"));				
				var middleLi3 = this.li("Interfaces: ");
				var interfaceUL = document.createElement("UL");
				var interfaceTo = this.li(a.TimeSampler[0]._processor);
				var interfaceFrom = this.li(a.TimeSampler[1]._processor);
				interfaceUL.appendChild(interfaceFrom);
				interfaceUL.appendChild(interfaceTo);

				middleUL.appendChild(middleLi1);
				middleUL.appendChild(middleLi2);
				middleUL.appendChild(middleLi3);
				middleLi3.appendChild(interfaceUL);
				li.appendChild(middleUL);
			}
		}
		timersTitle.onclick = function(){showHide(ul);};
		
	}
}
function hidePanel(div){
	for(var item of panelDivs){
		if(item !== div){			
			item.style.display = "none";
		}		
	}
}
function linkInPanel(maindiv,link,title){	
	var divInside =document.createElement("BUTTON");
	var divText = document.createTextNode(title);
	divInside.className = "ulfirstline";
	divInside.appendChild(divText);
	var ul = document.createElement("UL");
	ul.className = "ul1";
	maindiv.appendChild(divInside);
	maindiv.appendChild(ul);	
	if(link.length){
		for(var a of link){			
			var li = document.createElement("LI");
			var liText = showHideButton(a._name);
			li.appendChild(liText);
			ul.appendChild(li);
			
			var insideUl = document.createElement("UL");			
			li.appendChild(insideUl);
			var fromPort = showHideButton("Port : " + a.EthernetPort[0]._name);
			var toPort = showHideButton("Port: "+a.EthernetPort[1]._name);
			insideUl.appendChild(fromPort);
			insideUl.appendChild(toPort);			
		}
	}
	divInside.onclick = function(){showHide(ul);};
	
}
function clearInfoPanel(){
	document.getElementById("infoPanel").innerHTML = "";
}

function showHide(child){	
	if(child.style.display ==="block"){
		child.style.display = "none";
	}else{
		child.style.display = "block";
	}
}

function hostInfoPanel(host){	
	var outsideDiv = document.createElement("DIV");	
	var ul = document.createElement("UL");
	var modelP = li("Model: " +host._modelId);	
	ul.appendChild(modelP);

	// Generate ethernetPorts in Hosts.
	var etherPort = document.createElement("LI");
	var etherText = showHideButton("Ethernet Ports: " + Object.keys(host.EthernetPorts).length);
	var portUl = document.createElement("UL");
	portUl.className = "ul1";
	var port = li(host.EthernetPorts.EthernetPort._name);	
	portUl.appendChild(port);	
	etherPort.appendChild(etherText);
	etherPort.appendChild(portUl);
	ul.appendChild(etherPort);

	etherText.onclick = function(){showHide(portUl);};
	// Port detail


	// Generate softwareComponents in Hosts.
	var softwareComponent = document.createElement("LI");
	var softText = showHideButton("SoftwareComponents: " + Object.keys(host.SoftwareComponents.SoftwareComponent).length);
	ul.appendChild(softwareComponent);
	softwareComponent.appendChild(softText);
	var componentUl = document.createElement("UL");
	componentUl.className ="ul1";
	softText.onclick = function(){showHide(componentUl);};

	// Generate IP Stack
	var ipStack = document.createElement("LI");
	var ipStackText = showHideButton("IP Stack");
	ipStack.appendChild(ipStackText);
	componentUl.appendChild(ipStack);
	softwareComponent.appendChild(componentUl);
	var ipTimeUl = document.createElement("UL");
	ipTimeUl.className = "ul1";
	var ipTime = li("Execution Time: " + Math.round(host.SoftwareComponents.SoftwareComponent[0]._executionTime*1000000,2)+ " µs");
	ipTimeUl.appendChild(ipTime);
	ipStack.appendChild(ipTimeUl);
	ipStackText.onclick = function(){showHide(ipTimeUl);};

	// Generate Routing Module
	var routingModule = document.createElement("LI");
	var routingText = showHideButton("Routing Module");
	componentUl.appendChild(routingModule);
	routingModule.appendChild(routingText);
	var routingTimeUl = document.createElement("UL");
	routingTimeUl.className = "ul1";
	var routingTime = li("Execution Time: " + Math.round(host.SoftwareComponents.SoftwareComponent[1]._executionTime*1000000,2)+" µs");
	routingTimeUl.appendChild(routingTime);
	routingModule.appendChild(routingTimeUl);	
	routingText.onclick  = function(){showHide(routingTimeUl);};

	outsideDiv.appendChild(ul);

	return outsideDiv;
}

function switchInfoPanel(sw){	
	var outsideDiv = document.createElement("DIV");	
	var ul = document.createElement("UL");
	var modelP = li("Model: " +sw._modelId);	
	ul.appendChild(modelP);
	outsideDiv.appendChild(ul);

	// List of Ports
	var portList = document.createElement("LI");
	var portListText = showHideButton("Ports: "+ Object.keys(sw.EthernetPort).length);
	portList.appendChild(portListText);
	ul.appendChild(portList);
	if(Object.keys(sw.EthernetPort).length>=1){
		var portUl = document.createElement("UL");
		for(var i of sw.EthernetPort){			
			ul.appendChild(portUl);
			portUl.className ="ul1";
			//Port :4
			var portLi = document.createElement("LI");
			var portName = showHideButton(i._name);
			portUl.appendChild(portLi);

			// port1
			var detailUl = document.createElement("UL");
			//detailUl.className = "ul1";
			for(var a in i){
				if(a === "_speed"){
					var detailLi = li(nameChange(a) + ": "+ i[a]/1000000 + " Mbit/s");
				}else{
					var detailLi = li(nameChange(a) + ": "+ i[a]);
				}
				detailUl.appendChild(detailLi);
				portLi.appendChild(portName);
			}
			portLi.appendChild(detailUl);
			//portName.onclick= function(){showHide(detailUl);};
		}
		portListText.onclick = function(){showHide(portUl);};
	}

	return outsideDiv;
}

function sensorInfoPanel(sen){
	var outsideDiv = document.createElement("DIV");
	var ul = document.createElement("UL");
	var modelP = li("Model: " +sen._modelId);	
	ul.appendChild(modelP);
	outsideDiv.appendChild(ul);

	// List of Ports
	var portList = document.createElement("LI");
	var portListText = showHideButton("Ethernet Ports: "+ (sen.EthernetPort? 1 : 0));
	portList.appendChild(portListText);
	ul.appendChild(portList);
	if(sen.EthernetPort!==0){
		var portUl = document.createElement("UL");
				
		ul.appendChild(portUl);
		portUl.className ="ul1";
			//Port :4
		var portLi = document.createElement("LI");
		var portName = showHideButton(sen.EthernetPort._name);
		portUl.appendChild(portLi);

			// port1
		var detailUl = document.createElement("UL");
			//detailUl.className = "ul1";
		for(var a in sen.EthernetPort){	
			var detailLi;			
			if(a==="_speed"){
				detailLi = li(nameChange(a) + ": "+ sen.EthernetPort[a]/1000000 + " Mbit/s");
			}else{
				detailLi = li(nameChange(a) + ": "+ sen.EthernetPort[a]);
			}
			detailUl.appendChild(detailLi);
			portLi.appendChild(portName);
		}
		portLi.appendChild(detailUl);
			//portName.onclick= function(){showHide(detailUl);};
		
		portListText.onclick = function(){showHide(portUl);};
	}
	return outsideDiv;
}

function li(text){
	var e = document.createElement("LI");
	var eText = document.createTextNode(text);
	e.className="ulfirstline";
	e.appendChild(eText);
	return e;
}

function showHideButton(text){
	var b = document.createElement("BUTTON");
	var bText = document.createTextNode(text);
	b.className = "ulfirstline";
	b.appendChild(bText);
	return b;
}

function nameChange(name){
	var newName = name.charAt(1).toUpperCase() + name.slice(2);
	return newName;
}