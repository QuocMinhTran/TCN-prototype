/* global output */
/* exported loadFile, download */

function loadFile(inputFileList, callback) {
	var reader = new FileReader();
	reader.onload = callback;
	reader.readAsText(inputFileList[0], "UTF-8");
}
function saveProcess(){
	var answer = confirm("Are you sure to save this file?");
	if(answer){
		jsonObj = json;
	}
}
function download(filename) {
	if(jsonObj) {
		jsonObj = json;
		var x2js = new X2JS({ useDoubleQuotes: true });
		xmlObj = x2js.json2xml_str(jsonObj);
		output = formatXml(xmlObj);
		
	}else{
		alert("Please save what you have already done before downloading!");
		return;
	}
	var element = document.createElement("a");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + output));
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}