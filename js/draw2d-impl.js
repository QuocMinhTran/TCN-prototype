/* global draw2d */
/* exported initRenderer, clearRenderer, fillRenderer,... */
var app;
var example = {};
var panelDivs = [];
var json = {
	Network:{		
	}
};
var pos = [
	{
		x:0,
		y:0
	}
];
var deviceBody = `<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closePanel()">&times;</button>
                    <h4 id="deviceTitle" style="color:black;" class="modal-title">New Device</h4>
                </div>
                <div class="modal-body" id="deviceBody">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="deviceName">Name:</label>
                            <div class="col-md-8">
                                <input id="deviceName" name="deviceName" type="text" placeholder="Name..." class="form-control input-md required" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="radios">Device Type</label>
                            <div class="col-md-4">
                                <div class="radio">
                                    <label for="radios-0">
                            <input type="radio" name="radios" id="radios-0" value="1" checked="checked" onchange="radioOnChange()"> Host
                        </label>
                                </div>
                                <div class="radio">
                                    <label for="radios-1">
                            <input type="radio" name="radios" id="radios-1" value="2"onchange="radioOnChange()"> Switch
                        </label>
                                </div>
                            </div>
                        </div>
                        <!-- Select Basic -->
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="Model">Model:</label>
                            <div class="col-md-4">
                                <select id="Model" name="Model" class="form-control">
                            <option value="1">ECU</option>
                            <option value="2">Host</option>
                        </select>
                            </div>
                        </div>

                        <!-- Select Basic -->
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="Ports">Ethernet Ports:</label>
                            <div class="col-md-4">
                                <select id="Ports" name="Ports" class="form-control" onchange="portOnChange()">
                            <option value='0' >0</option>
                            <option value='1' selected="selected">1</option>
                        </select>
                            </div>
                            <button type="button" class="col-md-4 btn btn-default" data-toggle='collapse' data-target='#portDetail'>Port Details</button>
                        </div>
                        <div id="portDetail" class="collapse form-group">
                            <label class="col-md-12 control-labe">Ports:</label>
							<div id="detailPort">
                            <div class="col-md-3">
                                <label class="row">Speed</label>
                                <select id="speed" name="speed" class="form-control row">
                            <option value="10000000">10Mbit/s</option>
                            <option value="100000000">100Mbit/s</option>
                            <option value="1000000000">1Gbit/s</option>
                        </select>
                            </div>
                            <div class="col-md-3">
                                <label class="row">Priority</label>
                                <select id="priority" name="priority" class="form-control row">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="row">Mode</label>
                                <select id="mode" name="mode" class="form-control row">
                            <option value="TAG">TAG</option>
                            <option value="IP">IP</option>
                            <option value="PORT">PORT</option>                           
                        </select>
                            </div>
                            <div class="col-md-3">
                                <label class="row">Scheduling Policy</label>
                                <select id="policy" name="policy" class="form-control row">
                            <option value="Credit Based Shaper">Credit Based Shaper</option>
                            <option value="Strict Priority">Strict Priority</option>
                        </select>
                            </div>
							</div>
                        </div>
                        <div class="form-group" id="routingModule">
                            <label class="col-md-4 control-label" for="routing">Routing Module (µs):</label>
                            <div class="col-md-4">
                                <input id="routing" name="routing" type="text" class="form-control input-md" required="" onkeypress="return event.charCode >=48 && event.charCode <=57">
                            </div>
                        </div>
                        <div class="form-group" id="ipStack">
                            <label class="col-md-4 control-label" for="stack">IP Stack (µs):</label>
                            <div class="col-md-4">
                                <input id="stack" name="stack" type="text" class="form-control input-md" required="" onkeypress="return event.charCode >=48 && event.charCode <=57">
                            </div>
                        </div>
                    </form>                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" onclick="closePanel()">Cancel</button>
                    <button onclick="addNewHost()" class="btn btn-primary" data-dismiss="modal">Save</button>
                </div>
            </div>`;
var sensorBody = `<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closePanel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                    <h4 id="sensorTitle" style="color:black;" class="modal-title" id="mySensorLabel">New Sensor</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="sensorName">Name:</label>
                            <div class="col-md-8">
                                <input id="sensorName" name="sensorName" type="text" placeholder="Name..." class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="sensorType">Type:</label>
                            <div class="col-md-8">
                                <select id="sensorType" name="sensorType" class="form-control">
                                <option value="Video">Video</option>
                                <option value="Custom">Custom</option>
                            </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="sensorModel">Model:</label>
                            <div class="col-md-8">
                                <select id="sensorModel" name="sensorModel" class="form-control">
                                <option value="0">Generic Video Camera</option>
                            </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">Capture File:</label>
							<div class="col-md-8">
                            	<input type="file" name="sensorInput" id="sensorInput" class="inputfile" data-multiple-caption="{count} files select"
                                multiple/>
                            	<label class="btn btn-primary" for="sensorInput">Browse</label>
							</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">Port: </label>
                            <div class="col-md-8">
                                <select id="sensorPort" name="sensorPort" class="form-control">
                                <option value="Ethernet" >Ethernet</option>
                            </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">Speed:</label>
                            <div class="col-md-6">
                                <input type="text" class="input-md form-control" id="speedInput" name="speedInput" placeholder="100.0" />
                            </div>
                            <div class="col-md-2">
                                <select id="speedUnit" name="speedUnit" class="form-control">
								<option value="1">bit/s</option>
								<option value="1000">kbit/s</option>
                                <option value="1000000" selected>Mbit/s</option>
								<option value="1000000000">Gbit/s</option>
                            </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button onclick="addNewSensor()" class="btn btn-primary" >Save</button>
                    <button type="button" class="btn btn-default" onclick="closePanel()">Close</button>
                </div>
            </div>`;

var vlanBody = `<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closePanel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 style="color:black;" class="modal-title" id="myVlanLabel">New Vlan</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="vlanName">Name:</label>
                            <div class="col-md-8">
                                <input id="vlanName" name="vlanName" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
						<div class="form-group">
                            <label class="col-md-4 control-label" for="vlanID">ID:</label>
                            <div class="col-md-8">
                                <input id="vlanID" name="vlanID" type="text" class="form-control input-md" required="" onkeypress="return event.charCode >=48 && event.charCode <=57"/>
                            </div>
                        </div>       
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="vlanSource">Source:</label>
                            <div class="col-md-8">
                                <select id="vlanSource" name="vlanSource" class="form-control" onchange="updateVlanChange()">                                    
                                </select>
                            </div>
                        </div>                        
                        <div class="form-group">
                            <label class="col-md-4 control-label">Priority:</label>
                            <div class="col-md-8">
                                <select id="vlanPriority" name="vlanPriority" class="form-control">									                                 
                                </select>
                            </div>
                        </div>                        
                    </form>
                    <form id="vlanPathDiv" class="form-horizontal">
                        <div class="form-group">
                        <div>
                            <select style="height:200px;" id="vlanPath1" name="vlanPath1" class="form-control" multiple="multiple">                                
                            </select>
                        </div>                        
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button onclick="addNewVlan()" class="btn btn-primary">OK</button>                    
                    <button type="button" class="btn btn-default" onclick="closePanel()">Cancel</button>
                </div>
            </div>`;

example.InitRenderer = Class.extend({
	NAME: "example.InitRenderer",
	init: function () {
		this.canvas = new example.Canvas("myDiagramDiv");
		this.toolbar = new example.Toolbar("toolbar", this.canvas);		
		this.canvas.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy());
		//this.canvas.installEditPolicy(new draw2d.policy.canvas.FadeoutDecorationPolicy());
		this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({			
			createConnection: function(){	
						
				return new MyConnectionStyle();
			}
		}));	
		this.canvas.installEditPolicy(new draw2d.policy.canvas.CanvasPolicy({
			onDoubleClick : function(figure){
				if(figure!== null){
					figure.toFront();
					var identity = figure.cssClass;					
					switch(identity){
					case "draw2d_shape_basic_Rectangle":
						editDevice(figure, "Edit Host");
						break;
					case "draw2d_shape_icon_Db":
						editDevice(figure,"Edit Switch");
						break;
					case "draw2d_shape_icon_Photo":
						editSensor(figure,"Edit Sensor");
						break;
					default:
						alert("default");
					}
				}else{
					closePanel();
				}
			},
			onClick :function(figure){
				if(figure!== null){
					figure.toFront();					
				}else{
					closePanel();
				}
			}
		}));
		//initRenderer();
	}
});

example.Canvas = draw2d.Canvas.extend({
	NAME: "example.Canvas",
	init: function (id) {
		this._super(id, 2000, 1000);
		this.setScrollArea("#" + id);

	}
});

example.Toolbar = Class.extend({
	NAME:"example.Toolbar",
	init: function (elementId, view) {
		this.html = $("#" + elementId);
		this.view = view;		
		view.getCommandStack().addEventListener(this);

		view.on("select", $.proxy(this.onSelectionChanged, this));
		view.on("connect",function(emitter,event){	
			var source = event.connection.sourcePort.parent.id+"."+ event.connection.sourcePort.name;
			var target = event.connection.targetPort.parent.id+"."+event.connection.targetPort.name;
			var context = source+ "--"+ target;
			event.connection.label.text = context;
			let link = {
				"_name": context,
				EthernetPort:[
					{"_name":source},
					{"_name": target}
				]
			};
			var double = false;
			if("Links" in json.Network){
				for(var i of json.Network.Links.Link){				
					if((i.EthernetPort[0]._name === source&&i.EthernetPort[1]._name === target)||(i.EthernetPort[1]._name === source&&i.EthernetPort[0]._name === target)){
						double = true;
					}
				}
			}else{
				json.Network.Links = {};
				json.Network.Links.Link = [];
			}

			if(!double){
				event.connection.sourcePort.children.data[0].figure.children.data[2].figure.text = "Connected to: " + event.connection.targetPort.parent.id;
				event.connection.targetPort.children.data[0].figure.children.data[2].figure.text = "Connected to: " + event.connection.sourcePort.parent.id;

				json.Network.Links.Link.push(link);
				closePanel();			
			}				
		});
		view.on("disconnect",function(emitter,event){
			var source = event.connection.sourcePort.parent.id+"."+ event.connection.sourcePort.name;
			var target = event.connection.targetPort.parent.id+"."+event.connection.targetPort.name;			
			for(var link in json.Network.Links.Link){				
				var i = json.Network.Links.Link[link];
				if((i.EthernetPort[0]._name === source && i.EthernetPort[1]._name === target)||(i.EthernetPort[1]._name === source&&i.EthernetPort[0]._name === target)){
					json.Network.Links.Link.splice(link,1);
				}
			}	
			var sObj = event.connection.sourcePort.parent.id;
			var tObj = event.connection.targetPort.parent.id;
			if(!("DataFrames" in json.Network)){return;}
			for(var df in json.Network.DataFrames.DataFrame){
				var a = json.Network.DataFrames.DataFrame[df];				
				if(a.Path.length){
					for(var p in a.Path){
						var count = 0;
						for(var n of a.Path[p].Node){						
							if(n._name == sObj ||n._name == tObj){count++;}							
							if(count==2){
								a.Path.splice(p,1);
							}
							if(a.Path.length ==0){
								if("Timers" in json.Network){
									for(var t in json.Network.Timers.Timer){										
										if(json.Network.Timers.Timer[t]._dataFrame == a._name){
											json.Network.Timers.Timer.splice(t,1);
										}
									}
								}
								json.Network.DataFrames.DataFrame.splice(df,1);
							}
						}
					}
				}else{
					var count = 0;
					for(var n of a.Path.Node){						
						if(n._name == sObj ||n._name == tObj){count++;}						
						if(count==2){
							if("Timers" in json.Network){
								for(var t in json.Network.Timers.Timer){
									if(json.Network.Timers.Timer[t]._dataFrame == a._name){
										json.Network.Timers.Timer.splice(t,1);
									}
								}
							}
							json.Network.DataFrames.DataFrame.splice(df,1);
						}						
					}
				}
			}	
			if(!("Streams" in json.Network)){return;}
			for(var st in json.Network.Streams.Stream){
				var s = json.Network.Streams.Stream[st];				
				if(s.Path.length){
					for(var p in s.Path){
						var count = 0;
						for(var n of s.Path[p].Node){						
							if(n._name == sObj ||n._name == tObj){count++;}
							if(count==2){
								s.Path.splice(p,1);
							}
							if(s.Path.length ==0){
								if("Timers" in json.Network){
									for(var t in json.Network.Timers.Timer){
										if(json.Network.Timers.Timer[t]._dataFrame == s._name){
											json.Network.Timers.Timer.splice(t,1);
										}
									}
								}
								json.Network.Streams.Stream.splice(st,1);
							}
						}
					}
				}else{
					var count = 0;
					for(var n of s.Path.Node){						
						if(n._name == sObj ||n._name == tObj){count++;}
						if(count==2){
							if("Timers" in json.Network){
								for(var t in json.Network.Timers.Timer){
									if(json.Network.Timers.Timer[t]._dataFrame == s._name){
										json.Network.Timers.Timer.splice(t,1);
									}
								}
							}
							json.Network.Streams.Stream.splice(st,1);
						}						
					}
				}
			}	
				
		});
		view.on("figure:add",function(emitter,event){

			closePanel();
		});
		view.on("figure:remove", function(emitter,event){
			var array;			
			switch(event.figure.cssClass){
			case "draw2d_shape_basic_Rectangle" : 
				array = json.Network.Hosts.Host;
				break;					
			case "draw2d_shape_icon_Photo":
				array = json.Network.Sensors.Sensor;
				break;				
			case "draw2d_shape_icon_Db":
				array = json.Network.Switches.Switch;
				break;
			default:
				break;
				
			}
			for(var index in array){				
				if(array[index]._name === event.figure.id){					
					array.splice(index,1);
				}
			}	
			closePanel();
		});
		//Create singleChooseButton and functions
		this.singleChooseButton = $("<button class='gray'><span class='tooltiptext'>Single selection</span><i class='fa fa-mouse-pointer'></button>");
		this.html.append(this.singleChooseButton);
		this.singleChooseButton.click($.proxy(function(){
			this.view.installEditPolicy(new draw2d.policy.canvas.SingleSelectionPolicy());
			this.disableButton(this.readOnlyButton,false);
			this.disableButton(this.singleChooseButton,true);
		},this));

		//Create readOnlyMode and functions
		this.readOnlyButton = $("<button class='gray'><span class='tooltiptext'>Read Only</span><i class='fa fa-hand-grab-o'></button>");
		this.html.append(this.readOnlyButton);
		this.readOnlyButton.click($.proxy(function(){
			this.view.installEditPolicy(new draw2d.policy.canvas.ReadOnlySelectionPolicy());
			this.disableButton(this.readOnlyButton,true);
			this.disableButton(this.singleChooseButton,false);
		},this));

		//Create Undo button and functions
		this.undoButton = $("<button class='gray'><span class='tooltiptext'>Undo</span><i class='fa fa-arrow-circle-left'></i></button>");
		this.html.append(this.undoButton);
		this.undoButton.click($.proxy(function () {
			this.view.getCommandStack().undo();
		}, this));

		//Create Redo button and function.
		this.redoButton = $("<button class='gray'><span class='tooltiptext'>Redo</span><i class='fa fa-arrow-circle-right'></button>");
		this.html.append(this.redoButton);
		this.redoButton.click($.proxy(function () {
			this.view.getCommandStack().redo();
		}, this));

		//Create Delete button and function.
		this.deleteButton = $("<button class='gray'><span class='tooltiptext'>Delete</span><i class='fa fa-trash'></button>");
		this.html.append(this.deleteButton);
		this.deleteButton.click($.proxy(function () {
			var node = this.view.getPrimarySelection();			
			var command = new draw2d.command.CommandDelete(node);
			this.view.getCommandStack().execute(command);
		}, this));

		//Create Clear button and function.
		this.clearButton = $("<button class='gray'><span class='tooltiptext'>Clear</span><i class='fa fa-close'></button>");
		this.html.append(this.clearButton);
		this.clearButton.click($.proxy(function(){
			if(confirm("This will delete all data of the network. Continue?")){
				clearRenderer();
				this.disableButton(this.clearButton, true);
				this.disableButton(this.undoButton,true);				
			}
		},this));

		//Create add devices button and function.
		this.addDeviceButton = $("<button id='myBtn' class='gray'><span class='tooltiptext'>Add Device</span><i class='fa fa-microchip'></button>");
		this.html.append(this.addDeviceButton);
		this.addDeviceButton.click($.proxy(function(){
			$("#infoPanel").html("");			
			$("#infoPanel").append(deviceBody);
		},this));
		
		//Create add sensor button and function.
		this.sensorButton = $("<button id='sensorBtn' class='gray'><span class='tooltiptext'>Add Sensor</span><i class='fa fa-camera'></button>");
		this.html.append(this.sensorButton);
		this.sensorButton.click($.proxy(function(){	
			$("#infoPanel").html("");				
			$("#infoPanel").append(sensorBody);	
		},this));

		//Create add dataframe button and function.
		this.dataframeButton = $("<button id='dataframeBtn' class='gray'><span class='tooltiptext'>Add Data frame</span><i class='fa fa-object-group'></button>");
		this.html.append(this.dataframeButton);
		this.dataframeButton.click($.proxy(function(){
			var body = `<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closePanel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 style="color:black;" class="modal-title" id="myDFLabel">New Data Frame</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="dFName">Name:</label>
                            <div class="col-md-8">
                                <input id="dFName" name="dFName" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="dFSource">Source:</label>
                            <div class="col-md-8">
                                <select id="dFSource" name="dFSource" class="form-control">                                    
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="dFPeriod">Period (ms):</label>
                            <div class="col-md-8">
                                <input id="dFPeriod" name="dFPeriod" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="dFOffset">Offset (ms):</label>
                            <div class="col-md-8">
                                <input id="dFOffset" name="dFOffset" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">Priority:</label>
                            <div class="col-md-8">
                                <select id="dFPriority" name="dFPriority" class="form-control">                                    
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="dFSize">Size (bits):</label>
                            <div class="col-md-8">
                                <input id="dFSize" name="dFSize" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                    </form>
                    <form id="dfPathDiv" class="form-horizontal collapse">
                        <div class="form-group">
                        <div>
                            <select id="dfPath1" name="dfPath1" class="form-control" multiple="multiple">                                
                            </select>
                        </div>
                        <div>                            
                            <button onclick="addPath()" type="button" class="btn btn-default"><span class="fa fa-angle-double-up"></span> Add</button>
                            <button onclick="removePath()" type="button" class="btn btn-default">Remove <span class="fa fa-angle-double-down"></span></button>
                        </div>
                        <div>
                            <select id="dfPath2" name="dfPath2" class="form-control" multiple="multiple">                                
                            </select>
                        </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button onclick="addNewDF()" class="btn btn-primary">OK</button>
                    <button onclick="dFPathInfo()" id="addPath" type="button" class="btn btn-primary">Add Path(s)</button>
                    <button type="button" class="btn btn-default" onclick="closePanel()">Cancel</button>
                </div>
            </div>`;
			$("#infoPanel").html("");
			$("#infoPanel").append(body);
			if(json.Network.Hosts || json.Network.Sensors){
				var dfSource =document.getElementById("dFSource");
				dfSource.innerHTML = "";
				for(var key of json.Network.Hosts.Host){
					appendOptions(key._name,dfSource);
				}
				var dfPriority = document.getElementById("dFPriority");
				dfPriority.innerHTML ="";
				for(var i = 1;i<8;i++){
					appendOptions(i, dfPriority);
				}			
			}		
		},this));

		//Create add Stream button and function.
		this.streamButton = $("<button id='streamBtn' class='gray'><span class='tooltiptext'>Add Stream</span><i class='fa fa-play-circle'></button>");
		this.html.append(this.streamButton);
		this.streamButton.click($.proxy(function(){	
			var body=`<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closePanel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                    <h4 style="color:black;"class="modal-title" id="myStreamLabel">New Stream</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="streamName">Name:</label>
                            <div class="col-md-8">
                                <input id="streamName" name="streamName" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="streamSource">Source:</label>
                            <div class="col-md-8">
                                <select id="streamSource" name="streamSource" class="form-control">                                    
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="streamOffset">Offset (ms):</label>
                            <div class="col-md-8">
                                <input id="streamOffset" name="streamOffset" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                    </form>
					<form id="stPathDiv" class="form-horizontal collapse">
                        <div class="form-group">
                        <div>
                            <select id="dfPath1" name="dfPath1" class="form-control" multiple="multiple">                                
                            </select>
                        </div>
                        <div>                            
                            <button onclick="addPath()" type="button" class="btn btn-default"><span class="fa fa-angle-double-up"></span> Add</button>
                            <button onclick="removePath()" type="button" class="btn btn-default">Remove <span class="fa fa-angle-double-down"></span></button>
                        </div>
                        <div>
                            <select id="dfPath2" name="dfPath2" class="form-control" multiple="multiple">                                
                            </select>
                        </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button onclick="addNewStream()" class="btn btn-primary" onclick="closePanel()">OK</button>
                    <button class="btn btn-primary" onclick="stPathInfo()">Add Path(s)</button>
                    <button type="button" class="btn btn-default" onclick="closePanel()">Cancel</button>
                </div>
            </div>`;
			$("#infoPanel").html("");
			$("#infoPanel").append(body);
			if("Sensors" in json.Network){
				for(var key of json.Network.Sensors.Sensor){
					var sName = key._name;
					var bool = false;
					if(!("Streams" in json.Network)){
						json.Network.Streams = {};
						json.Network.Streams.Stream = [];
					}
					for(var st of json.Network.Streams.Stream){
						if(st._source == sName){bool = true;}
					}
					if(bool == false){appendOptions(sName,document.getElementById("streamSource"));}
				}
			}
		},this));

		//Create add Timer button and function.
		this.timerButton = $("<button id='timerBtn' class='gray'><span class='tooltiptext'>Add Timer</span><i class='fa fa-clock-o'></button>" );
		this.html.append(this.timerButton);
		this.timerButton.click($.proxy(function(){
			var body=`<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closePanel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                    <h4 style="color:black;"class="modal-title" id="myTimerLabel">New Timer</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="timerID">ID:</label>
                            <div class="col-md-8">
                                <input id="timerID" name="timerID" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="timerFlow">Flow:</label>
                            <div class="col-md-8">
                                <select id="timerFlow" name="timerFlow" class="form-control">                                    
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="timerMACAdress">Target MAC Address:</label>
                            <div class="col-md-8">
                                <input id="timerMACAdress" name="timerMACAdress" type="text" class="form-control input-md" required="" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">Ingress Interface:</label>
                            <div class="col-md-8">
                                <select id="ingressInterface" name="ingressInterface" class="form-control">                                    
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label">Egress Interface: </label>
                            <div class="col-md-8">
                                <select id="egressInterface" name="egressInterface" class="form-control">                                
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button onclick="addNewTimer()" class="btn btn-primary" >Save</button>
                    <button type="button" class="btn btn-default" onclick="closePanel()">Close</button>
                </div>
            </div>`;
			$("#infoPanel").html("");
			$("#infoPanel").append(body);
			var timerFlow =document.getElementById("timerFlow");			
			if(json.Network.DataFrames){
				for(var key of json.Network.DataFrames.DataFrame){
					appendOptions(key._name,timerFlow);
				}							
			}
			if(json.Network.Streams){
				for(var key of json.Network.Streams.Stream){
					appendOptions(key._name,timerFlow);
				}
			}	
			if(json.Network.Switches){
				for(var key of json.Network.Switches.Switch){					
					for(var key2 of key.EthernetPort){						
						appendOptions((key._name+"."+key2._name),document.getElementById("ingressInterface"));
						appendOptions((key._name+"."+key2._name),document.getElementById("egressInterface"));
					}
				}
			}	
		},this));

		//Create add VLANs button and function.
		this.vlanButton = $("<button id='vlanBtn' class='gray'><span class='tooltiptext'>Add Vlans</span><i class='fa fa-code-fork'></button>");
		this.html.append(this.vlanButton);
		this.vlanButton.click($.proxy(function(){	
			$("#infoPanel").html("");				
			$("#infoPanel").append(vlanBody);	
			if(json.Network.DataFrames){
				var vlanSource =document.getElementById("vlanSource");
				vlanSource.innerHTML = "";
				for(var key of json.Network.DataFrames.DataFrame){
					if(!("_vlanId" in key)){
						appendOptions(key._name,vlanSource);
					}
				}
				var vlanPriority = document.getElementById("vlanPriority");
				vlanPriority.innerHTML ="";
				for(var i = 1;i<8;i++){
					appendOptions(i, vlanPriority);
				}		
				updateVlanChange();	
			}	
		},this));

		//disable buttons
		this.disableButton(this.undoButton, true);
		this.disableButton(this.redoButton, true);
		this.disableButton(this.deleteButton, true);
		this.disableButton(this.clearButton,true);
		this.disableButton(this.singleChooseButton,true);
	},	
	disableButton: function (button, flag) {
		button.prop("disabled", flag);
		if (flag) {
			button.addClass("disabled");
		} else {
			button.removeClass("disabled");
		}
	},
	onSelectionChanged: function (emitter, event) {
		this.disableButton(this.deleteButton, event.figure === null);
	},
	stackChanged: function (event) {
		this.disableButton(this.clearButton, event === null);
		this.disableButton(this.undoButton, !event.getStack().canUndo());
		this.disableButton(this.redoButton, !event.getStack().canRedo());
	}
});
function radioOnChange(){
	var checked = $("input[name='radios']:checked").val();
	if(checked==1){
		$("#Model").html("");
		$("#Model").html("<option value='1'>ECU</option><option value='2'>Host</option>");
		$("#Ports").html("");
		$("#Ports").html("<option value='0'>0</option><option selected='selected'value='1'>1</option>");
		$("#ipStack *").prop("disabled",false);
		$("#routingModule *").prop("disabled",false);
		portOnChange();
	}else{
		$("#Model").html("");
		$("#Model").html("<option value='1'>Generic</option>");
		$("#Ports").html("");
		$("#Ports").html("<option selected='selected' value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option>");
		$("#ipStack *").prop("disabled",true);
		$("#routingModule *").prop("disabled",true);
		portOnChange();
	}
}
function portOnChange(){
	var checked =$("#Ports option:selected").val();
	var body =`<div>
                            <div class="col-md-3">
                                <label class="row">Speed</label>
                                <select id="speed" name="speed" class="form-control row">
                            <option value="10000000">10Mbit/s</option>
                            <option value="100000000">100Mbit/s</option>
                            <option value="1000000000">1Gbit/s</option>
                        </select>
                            </div>
                            <div class="col-md-3">
                                <label class="row">Priority</label>
                                <select id="priority" name="priority" class="form-control row">
									<option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="row">Mode</label>
                                <select id="mode" name="mode" class="form-control row">
                            <option value="TAG">TAG</option>
                            <option value="IP">IP</option>
                            <option value="PORT">PORT</option>                           
                        </select>
                            </div>
                            <div class="col-md-3">
                                <label class="row">Scheduling Policy</label>
                                <select id="policy" name="policy" class="form-control row">
                            <option value="Credit Based Shaper">Credit Based Shaper</option>
                            <option value="Strict Priority">Strict Priority</option>
                        </select>
                            </div>
							</div>`;
	$("#detailPort").html("");
	for(var i = 0;i<checked;i++){
		$("#detailPort").append(body);
	}	
}
var MyConnectionStyle = draw2d.Connection.extend({

	init: function (attr) {		
		this._super(attr);

		this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
		this.setOutlineStroke(1);
		this.setOutlineColor("#303030");
		this.setStroke(5);
		this.setColor("#00A8F0");
		this.setRadius(0);		
		// Create label for connection
		this.label = new draw2d.shape.basic.Label({			
			color : "#0d0d0d",
			fontColor: "#0d0d0d",
			bgColor : "#f0f0f0"
		});	

		// add decorations to the connection
		this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator());
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		
		var show = function(){this.setVisible(true);};
		var hide = function(){this.setVisible(false);};
		this.on("mouseenter", show,this.label);
		this.on("mouseleave", hide,this.label);		
		this.label.setVisible(false);
	},	

    /**
     * @method
     * called by the framework if the figure should show the contextmenu.</br>
     * The strategy to show the context menu depends on the plattform. Either loooong press or
     * right click with the mouse.
     * 
     * @param {Number} x the x-coordinate to show the menu
     * @param {Number} y the y-coordinate to show the menu
     * @since 1.1.0
     */
	onContextMenu: function (x, y) {		
		$.contextMenu({
			selector: "body",
			events:
			{
				hide: function () { $.contextMenu("destroy"); }
			},
			callback: $.proxy(function (key, options) {
				switch (key) {
				case "edit":
					this.setColor("#f3546a");
					break;
				case "delete":
						// without undo/redo support
						//     this.getCanvas().remove(this);

						// with undo/redo support
					var cmd = new draw2d.command.CommandDelete(this);
					this.getCanvas().getCommandStack().execute(cmd);
				default:
					break;
				}

			}, this),
			x: x,
			y: y,
			items:
			{
				"edit": { name: "Edit Link" },
				"sep1": "---------",
				"delete": { name: "Delete" }
			}
		});
	}
});

function closePanel(){
	clearInfoPanel();	
	infoPanelRenderer(json);
	for(var i =0; i<Path.length;i++){
		Path.pop();
	}
	
}
function clearRenderer() {
	app.canvas.clear();
	clearInfoPanel();
	json = {
		Network:{			
		}
	};
	
	console.log(json);
}
function randomPlace(a) {
	return Math.floor((Math.random() * a) + 1);
}
function givenPos(width,height){
	var condition = true;	
	var count = 0;
	while(condition && count <10){		
		var overlapped = false;
		var curPos = {
			x : randomPlace(width),
			y :randomPlace(height)
		};		
		
		for(var i of pos){
			if(i.x-100<curPos.x&& curPos.x<i.x+100&&i.y-100<curPos.y&& curPos.y<i.y+100){				
				overlapped = true;
			}
		}
		if(overlapped==false){			
			pos.push(curPos);
			condition = false;
			return curPos;
		}
		count++;
	}
}
var DecoratedHybridPort = draw2d.HybridPort.extend({
	init : function(attr, setter, getter){
		this._super(attr,setter,getter);
		
		// Create container for connection
		this.container = new TableTestFigure();

		// add decorations to the connection
		this.add(this.container, new draw2d.layout.locator.RightLocator());
		
		
		var show = function(){this.setVisible(true);};
		var hide = function(){this.setVisible(false);};
		this.on("mouseenter", show,this.container);
		this.on("mouseleave", hide,this.container);
		this.container.setVisible(false);
		//this.on("connect",hide,this);
		//this.on("disconnect",show,this);
		this.setValue(true);
	}
});

var TableTestFigure = draw2d.shape.layout.TableLayout.extend({
	init: function(attr){
		this._super($.extend({
			stroke:1,
			bgColor : "#FFFFFF",
			radius:0
			
		}, attr));

		this.id = this.createLabel();
		this.speed = this.createLabel();
		this.connectedTo = this.createLabel();

		this.addRow(this.id);
		this.addRow(this.speed);
		this.addRow(this.connectedTo);
	},
	createLabel : function(){
		return new draw2d.shape.basic.Label({
			color : "#0d0d0d",
			fontColor: "#0d0d0d",			
			stroke : 0,
			padding :5,
			width:200
		});
	}
});

var timerPort = draw2d.HybridPort.extend({
	init : function(attr, setter, getter){
		this._super(attr,setter,getter);
		
		// Create label for connection
		this.label = new draw2d.shape.basic.Label({			
			color : "#0d0d0d",
			fontColor: "#0d0d0d",
			bgColor : "#f0f0f0"
		});

		// Create clock for timer
		this.icon = new draw2d.shape.icon.future({width:10,height:10});
		this.add(this.icon, new draw2d.layout.locator.CenterLocator());
		// add decorations to the connection
		this.add(this.label, new draw2d.layout.locator.LeftLocator());		
		
		var show = function(){this.setVisible(true);};
		var hide = function(){this.setVisible(false);};
		this.on("mouseenter", show,this.label);
		this.on("mouseleave", hide,this.label);
		this.label.setVisible(false);

		this.setValue(true);
	}
});

function portRenderer(hostOrSensor, portAmount) {	
	var inputLocator = new draw2d.layout.locator.InputPortLocator();
	var outputLocator = new draw2d.layout.locator.OutputPortLocator();
	if (portAmount.length) {
		for (var i = 0; i < portAmount.length; i++) {
			var newPort;
			newPort = new DecoratedHybridPort();
			newPort.name = portAmount[i]._name;
			newPort.children.data[0].figure.children.data[0].figure.text = newPort.name ;
			newPort.children.data[0].figure.children.data[1].figure.text = portAmount[i]._speed/1000000 + " Mbit/s";
			newPort.children.data[0].figure.children.data[2].figure.text = "I Have a looooooooong name";
			if (i % 2 === 0) {
				hostOrSensor.addPort(newPort, inputLocator);
				//console.log(newNode);				
			}
			else {				
				hostOrSensor.addPort(newPort, outputLocator);	
			}
			//newPort.name = portAmount[i]._name;
		}
	} else {
		//alert(hostOrSwitch.id + "." + portAmount._name);
		newPort = new DecoratedHybridPort();
		newPort.name = portAmount._name;
		newPort.children.data[0].figure.children.data[0].figure.text = newPort.name;
		newPort.children.data[0].figure.children.data[1].figure.text = portAmount._speed/1000000 + " Mbit/s";
		newPort.children.data[0].figure.children.data[2].figure.text = "I Have a looooooooong name";

		hostOrSensor.addPort(newPort);
		//console.log(newNode);
		
	}
	var newPos = new givenPos(1000,700);
	console.log(newPos);
	var command = new draw2d.command.CommandAdd(app.canvas,hostOrSensor,newPos.x,newPos.y);
	app.canvas.getCommandStack().execute(command);
}

function hostRenderer(name) {
	let host = new draw2d.shape.basic.Rectangle({ width: 100, height: 100, id: name });
	let label = new draw2d.shape.basic.Label({ text: name });
	host.add(label, new draw2d.layout.locator.CenterLocator());
	label.installEditor(new draw2d.ui.LabelInplaceEditor());	
	return host;
}

function switchRenderer(name) {
	let s = new draw2d.shape.icon.Db({ width: 100, height: 100, id: name });
	let label = new draw2d.shape.basic.Label({ text: name, bgColor: "#FFFEF9" });
	s.add(label, new draw2d.layout.locator.CenterLocator());
	label.installEditor(new draw2d.ui.LabelInplaceEditor());
	return s;
}

function sensorRenderer(name) {
	let sen = new draw2d.shape.icon.Photo({ width: 100, height: 100, id: name });
	let label = new draw2d.shape.basic.Label({ text: name, bgColor: "#FFFEF9" });
	sen.add(label, new draw2d.layout.locator.CenterLocator());
	label.installEditor(new draw2d.ui.LabelInplaceEditor());
	return sen;
}

function splitString(name) {
	var newName = name.split(".");
	return newName;
}
function portReturner(start, end) {
	var newName = splitString(start);
	for (var i = 0; i < app.canvas.figures.data.length; i++) {
		if (app.canvas.figures.data[i].id === newName[0]) {
			var port = app.canvas.figures.data[i].getHybridPort(newName[1]);
			port.children.data[0].figure.children.data[2].figure.text = "Connected to : "+ end;			
			return port;
		}
	}
}

function timerRenderer(start, name){
	var newStart = splitString(start[0]._processor);
	var newEnd = splitString(start[1]._processor);	
	findTimer(newStart, name);
	findTimer(newEnd, name);
}
function findTimer(newStart, name){
	for (var i = 0; i < app.canvas.figures.data.length; i++) {
		if (app.canvas.figures.data[i].id === newStart[0]) {
			for(var obj in app.canvas.figures.data[i].hybridPorts.data){
				if(app.canvas.figures.data[i].hybridPorts.data[obj].name === newStart[1]){
					app.canvas.figures.data[i].hybridPorts.data[obj].bgColor.hashString ="#ff0000";
					app.canvas.figures.data[i].hybridPorts.data[obj].color.hashString ="#ff0000";
					var port = app.canvas.figures.data[i].getHybridPort(newStart[1]);	
					port.children.data[0].figure.children.data[2].figure.text = "Timer";				
					var label = new draw2d.shape.basic.Label({text: name._name, stroke:0, padding: 5});
					port.children.data[0].figure.addRow(label);
					
				}
			}
		}
	}
}
function linkRenderer(id,start, end) {
	var c = new MyConnectionStyle({
		id: id,
		newstart : start,
		source: portReturner(start,end),
		target: portReturner(end, start),
	});	
	c.children.data[0].figure.text = start + " -- "+ end;
	app.canvas.add(c);
}

function dataFrameRenderer(links,start,end){
	for(var obj of links){
		var c = splitString(obj.EthernetPort[0]._name);
		var d = splitString(obj.EthernetPort[1]._name);
		
		if((start=== c[0] && end === d[0]) || (start ===d[0] && end ===c[0])){
			for(var link of app.canvas.lines.data){
				if(link.id === obj._name){
					link.lineColor.hashString = "#545465";
				}
			}
		}
	}
}
function fillData(data, container){
	if(!data){return;}
	if(Array.isArray(data)){
		for(var i of data){
			container.push(i);
		}
	}else{
		container.push(data);
	}
}
function fillRenderer(data) {
	if (data) {	
		console.log(data);			
		json = {
			Network:{
				Hosts:{
					Host:[]
				},
				Switches:{
					Switch:[]
				},
				Links:{
					Link:[]
				},
				Sensors:{
					Sensor:[]
				},
				Timers:{
					Timer:[]
				},
				Streams:{
					Stream:[]
				},
				Vlans:{
					Vlan:[]
				},
				DataFrames:{
					DataFrame:[]
				}
			}
		};
		
		
		if(data.Network.DataFrames){			
			fillData(data.Network.DataFrames.DataFrame,json.Network.DataFrames.DataFrame);
		}
		
		if(data.Network.Vlans){			
			fillData(data.Network.Vlans.Vlan,json.Network.Vlans.Vlan);
		}

		if(data.Network.Streams){
			fillData(data.Network.Streams.Stream,json.Network.Streams.Stream);
		}
		let b = null;
		if(data.Network.Hosts){			
			fillData(data.Network.Hosts.Host,json.Network.Hosts.Host);
			b = json.Network.Hosts.Host;
		}
		var host, ePort;
		if (b !== null && b.length) {
			for (var obj in b) {				
				host = hostRenderer(b[obj]._name);
				ePort = b[obj].EthernetPorts.EthernetPort;
				portRenderer(host, ePort);
			}
		}
		/*else if (b !== null) {
			host = hostRenderer(b._name);
			ePort = b.EthernetPorts.EthernetPort;
			portRenderer(host, ePort);
		}*/

		let a = null;
		if(data.Network.Switches){			
			fillData(data.Network.Switches.Switch,json.Network.Switches.Switch);
			a = json.Network.Switches.Switch;
		}
		var s, sePort;
		if (a !== null && a.length) {
			for (var obj2 in a) {	
				s = switchRenderer(a[obj2]._name);
				sePort = a[obj2].EthernetPort;
				portRenderer(s, sePort);
			}
		}
		/*else if (a !== null) {
			s = switchRenderer(a._name);
			sePort = a.EthernetPort;
			portRenderer(s, sePort);
		}*/

		let c = null;
		if(data.Network.Sensors){			
			fillData(data.Network.Sensors.Sensor,json.Network.Sensors.Sensor);
			c = json.Network.Sensors.Sensor;
		}
		var sen, senPort;
		if (c !== null && c.length) {
			for (var obj3 in c) {				
				sen = sensorRenderer(c[obj3]._name);
				senPort = c[obj3].EthernetPort;
				portRenderer(sen, senPort);
			}
		} /*else if (c !== null) {
			sen = switchRenderer(c._name);
			senPort = c.EthernetPort;
			portRenderer(sen, senPort);
		}*/


		let links = json.Network.Links ? json.Network.Links.Link:null;
		if(data.Network.Links){			
			fillData(data.Network.Links.Link,json.Network.Links.Link);
			c = json.Network.Links.Link;
		}
		if (links) {
			for (var l = 0; l < links.length; l++) {
				//console.log(links[l].EthernetPort[0]._name);
				linkRenderer(links[l]._name,links[l].EthernetPort[0]._name, links[l].EthernetPort[1]._name);
			}
		}

		let t = null;
		if(data.Network.Timers){			
			fillData(data.Network.Timers.Timer,json.Network.Timers.Timer);
			t = json.Network.Timers.Timer;
		}
		if(t !== null){
			for(var obj of t){
				var timePort1 = obj.TimeSampler;				
				timerRenderer(timePort1, obj);
			}
		}		
	}
	closePanel();
	console.log(json);
	console.log(app.canvas);
}
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
