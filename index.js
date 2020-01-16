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
	//MUTATORS
	set groups(nodes) {
		this._groups = nodes;
	}
	set startIndex(start) {
		this._start = start;
	}
	set endIndex(end) {
		this._end = end;
	}
	set depth(depth) {
		this._depth = depth;
	}
	// ACCESSORS
	get groups() {
		return this._groups;
	}
	get startIndex() {
		return this._start;
	}
	get endIndex() {
		return this._end;
	}
	get depth() {
		return this._depth;
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

	var annotation = new Annotation();
	annotation.startIndex = getTotalOffset(sel.anchorNode, sel.anchorOffset);
	annotation.endIndex = getTotalOffset(sel.focusNode, sel.focusOffset);
	
	var depth = getDepthRange(annotation);
	annotation.depth = depth;
	maxDepth = Math.max(maxDepth, depth);
	
	var styleAttr = `color:red; line-height: ${20+(depth-1)}px; padding-bottom: ${4*(depth-1)}px;`;

	var currentNode = anchor;

	var nextNode;
	var selectionLength = sel.toString().length;
	
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
	annotation.groups = newNodes;

	ANNOTATIONS.push(annotation);
}

var getDepth = function(node) {
	var depth;
	for (depth = 0; !node.parentElement.id || node.parentElement.id != "textbody"; node=node.parentElement, depth++);
	return depth
}

var getDepthRange = function(annotation) {
	var validDepths = [];
	for (var i=0; i<maxDepth+1; i++){
		validDepths.push(i+1);
	}	
	for (var previous of ANNOTATIONS) {
		if (previous.startIndex < annotation.endIndex && annotation.startIndex < previous.endIndex) {
			validDepths[previous.depth - 1] = -1;
		}
	}
	console.log(validDepths);
	for (var i of validDepths){
		if (i>0) {
			return i;
		}
	}	
	return maxDepth+1;
}

var getTotalOffset = function(anchor, anchorOffset) {
	var escaped = /(\t|\n|\r)+/;
	var offset = anchorOffset - (anchor.textContent.substring(0,anchorOffset).length - anchor.textContent.substring(0,anchorOffset).replace(escaped,'').length);
	var node = anchor;
	while (node != document.getElementById("textbody")) {
		if (node.previousSibling != null) {
			node = node.previousSibling;
			offset += node.textContent.replace(escaped,'').	length;
		}
		else {
			node = node.parentNode;
		}
	}
	return offset;
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
		return processTextNode(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes);
	}
	else if (currentNode.nodeType == ELEMENT_NODE) {
		var modified = document.createElement("span");
		modified.setAttribute("class", currentNode.getAttribute("class"))
		modified.setAttribute("style", currentNode.getAttribute("style"))
		for (var child of currentNode.childNodes){
			var processedChildren = processNode(child, anchor, sel, selectionLength, styleAttr, modifiedNodes);
			for (var processedChild of processedChildren){
				modified.appendChild(processedChild);
			}
			selectionLength -= child.textContent;
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
	var escaped = /(\n|\r|\t)/;
	while (escaped.exec(currentNode.nodeValue[start])){
		start ++;
	}
	var end = start + selectionLength;
	if (end - start > selectionLength) {
		end = Math.min(start + selectionLength, currentNode.nodeValue.length);
	}

	var subsections = []
	if (currentNode == anchor){
		var before = document.createTextNode(currentNode.nodeValue.slice(0, start));
		subsections.push(before);
	}
	var modified = document.createElement("span");
	modified.classList.add("annotated");
	modified.setAttribute("style",styleAttr);
	modified.appendChild(document.createTextNode(currentNode.nodeValue.slice(start, end)));
	modifiedNodes.push(modified);
	var after = document.createTextNode(currentNode.nodeValue.slice(end));
	
	subsections = subsections.concat([modified, after]);
	return subsections
}