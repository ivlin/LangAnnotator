const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

var ANNOTATIONS = []

class Annotation {
	constructor() {
		this._groups = []
	}
	add(node) {
		this._groups.push(node);
	}
	get groups() {
		return this._groups;
	}
}

document.getElementById("textbody").addEventListener("mouseup", function(e){
	mouseUpResponse();
});

var maxDepth = 0;

function mouseUpResponse() {
	if (document.getSelection) {    // all browsers, except IE before version 9
		var sel = document.getSelection();
        styleSelection(sel);
        sel.empty();
  	}
}

var styleSelection = function(sel) {
	var anchor = sel.anchorNode;
	var selectionText = sel.toString();

	var depth = getDepth(anchor);
	var styleAttr = `color:red; line-height: ${20+depth}px; padding-bottom: ${4*depth}px;`;

	var updatedInnerHTML = "";
	var newAnnotation = new Annotation();
	
	var currentNode = anchor;

	var nextNode;
	var selectionLength = selectionText.length;
	
	var offset = sel.anchorOffset;

	var newNodes = [];

	//reapply event listeners?
	while (selectionLength > 0){
		var styledNodes = processNode(currentNode, anchor, sel, selectionLength, styleAttr, newNodes);
		if (styledNodes != null) {
			nextNode = getNext(currentNode);

			for (var i = 0; i < styledNodes.length; i++){
				styledNodes[i].parentNode = currentNode.parentNode; 
				currentNode.parentNode.insertBefore(styledNodes[i], currentNode);				
			}
			currentNode.parentNode.removeChild(currentNode);

			if (currentNode == anchor){
				selectionLength -= currentNode.nodeValue.length - offset;
			}
			else {
				selectionLength -= currentNode.textContent.length;
			}

			currentNode = nextNode;
		}
		else {
			console.log("current node is null");
			break;
		}
	}

	//anchor.parentElement.innerHTML = updatedInnerHTML;
}

var getDepth = function(node) {
	var depth;
	for (depth = 0; !node.parentElement.id || node.parentElement.id != "textbody"; node=node.parentElement, depth++);
	return depth
}

var getNext = function(node) {
	while (node.nextSibling == null && node.parentNode != document.getElementById("textbody")) {
		node = node.parentNode;
	}
	if (node.nextSibling != null) {
		return node.nextSibling;
	}
	else {
		return null;
	}
}

var processNode = function(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes) {
	if (currentNode == null || currentNode.id == "textbody") {
		console.log("invalid input");
		return null;
	}	
	if (currentNode.nodeType == TEXT_NODE) {
		processTextNode(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes);
	}
	else if (currentNode.nodeType == ELEMENT_NODE) {
		var modified = document.createElement("span");
		for (var i=0; i<currentNode.childNodes.length; i++){
			var processedChildren = processNode(currentNode.childNodes[i], anchor, sel, selectionLength, styleAttr, modifiedNodes);
			console.log(processedChildren);
			for (var j=0; j<processedChildren.length; j++){
				modified.appendChild(processedChildren[j]);
			}
			selectionLength -= currentNode.childNodes[i].textContent;
		}
		return [modified];
	}
	console.log("processNode failure");
	return null;
}

var processTextNode = function(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes) {
		var start = 0;
		if (currentNode == anchor) {
			start = sel.anchorOffset;
		}
		var escaped = /(\n|\r)/;
		while (escaped.exec(currentNode.nodeValue[start])){
			start ++;
		}
		var end = start + selectionLength;
		if (end - start > selectionLength) {
			end = Math.min(start + selectionLength, currentNode.nodeValue.length);
		}
		if (currentNode == anchor) {
			var before = document.createTextNode(currentNode.nodeValue.slice(0, start));
			var modified = document.createElement("span");
			modified.classList.add("annotated");
			modified.setAttribute("style",styleAttr);
			modified.appendChild(document.createTextNode(currentNode.nodeValue.slice(start, end)));
			modifiedNodes.push(modified);
			var after = document.createTextNode(currentNode.nodeValue.slice(end));
			return [before, modified, after];
		}
		else {	
			var modified = document.createElement("span");
			modified.classList.add("annotated");
			modified.setAttribute("style",styleAttr);
			modified.appendChild(document.createTextNode(currentNode.nodeValue.slice(start, end)));
			modifiedNodes.push(modified);
			var after = document.createTextNode(currentNode.nodeValue.slice(end));
			return [modified, after]
		}
}