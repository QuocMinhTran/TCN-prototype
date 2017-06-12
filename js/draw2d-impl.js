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
	var newPos = new givenPos(800,650);
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