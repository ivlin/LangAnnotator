import React from 'react';
import ReactDOM from 'react-dom';

import AnnotationModal from './AnnotationModal'

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
		
class Annotation {
	constructor() {
		this._groups = []
	}
	add(node) {
		this._groups.push(node);
	}
	//MUTATORS
	set id(id) {
		this._id = id;
	}
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
	set title(title) {
		this._title = title;
	}
	set description(desc) {
		this._description = desc;
	}
	set selection(sel) {
		this._selection = sel;
	}
	// ACCESSORS
	get id() {
		return this._id;
	}
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
	get title() {
		return this._title;
	}
	get description() {
		return this._description;
	}
	get selection() {
		return this._selection;
	}
}

export default class MainText extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			ANNOTATIONS: [], 
			annotation_id: 1, 
			maxDepth: 0
		};
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}

	handleMouseUp() {
		if (document.getSelection() && document.getSelection().toString().length>0) {    // all browsers, except IE before version 9
			var sel = document.getSelection();
        	var input = this.getUserInput();
        	var annotation = new Annotation();
        	annotation.description = input;
        	annotation.selection = sel;
        	this.styleSelection(sel, annotation, "textbody");
        	sel.empty();

        	this.render();
  		}
	}

	getUserInput() {
		return window.prompt("What is this annotation for?","");
	}
	
	styleSelection(sel, annotation, containerid) {
		var anchor = sel.anchorNode;

		annotation.id = this.state.annotation_id;
		annotation.startIndex = this.getTotalOffset(sel.anchorNode, sel.anchorOffset, containerid);
		annotation.endIndex = this.getTotalOffset(sel.focusNode, sel.focusOffset, containerid);
	
		var depth = this.getDepthRange(annotation);
		annotation.depth = depth;
		this.setState({maxDepth: Math.max(this.state.maxDepth, depth)});
	
		var styleAttr = `color:red; line-height: ${20+(depth-1)}px; padding-bottom: ${4*(depth-1)}px;`;
		var currentNode = anchor;
		var nextNode;
		var selectionLength = sel.toString().length;	
		var offset = sel.anchorOffset;
		var newNodes = [];
		//reapply event listeners?
		while (selectionLength > 0){
			var styledNodes = this.processNode(currentNode, anchor, sel, selectionLength, styleAttr, newNodes, annotation.id, annotation, containerid);
			if (styledNodes !== null) {
				nextNode = this.getNext(currentNode);
				for (var i = 0; i < styledNodes.length; i++){
					//styledNodes[i].parentNode = currentNode.parentNode; 
					//currentNode.parentNode.appendChild(styledNodes[i]);
					currentNode.parentNode.insertBefore(styledNodes[i], currentNode);				
				}
				currentNode.parentNode.removeChild(currentNode);
				if (currentNode === anchor){
					selectionLength -= currentNode.nodeValue.length - offset;
				}
				else {
					selectionLength -= currentNode.textContent.length;
				}
				currentNode = nextNode;
			}
			else {
				break;
			}
		}
		annotation.groups = newNodes;
		this.setState({annotation_id: this.state.annotation_id+1});
		this.state.ANNOTATIONS.push(annotation);
	}

	getDepthRange(annotation) {
		var validDepths = [];
		for (var i=0; i<this.state.maxDepth+1; i++){
			validDepths.push(i+1);
		}	
		for (var previous of this.state.ANNOTATIONS) {
			if (previous.startIndex < annotation.endIndex && annotation.startIndex < previous.endIndex) {
				validDepths[previous.depth - 1] = -1;
			}
		}
		for (var d of validDepths){
			if (d>0) {
				return d;
			}
		}	
		return this.state.maxDepth+1;
	}

	getTotalOffset(anchor, anchorOffset, containerid) {
		var escaped = /(\t|\n|\r)+/;
		var offset = anchorOffset - (anchor.textContent.substring(0,anchorOffset).length - anchor.textContent.substring(0,anchorOffset).replace(escaped,'').length);
		var node = anchor;
		while (node !== document.getElementById(containerid)) {
			if (node.previousSibling !== null) {
				node = node.previousSibling;
				offset += node.textContent.replace(escaped,'').length;
			}
			else {
				node = node.parentNode;
			}
		}
		return offset;
	}

	getNext(node, containerid) {
		while (node.nextSibling === null && node.parentNode !== document.getElementById(containerid)) {
			node = node.parentNode;
		}
		if (node.nextSibling !== null) {
			return node.nextSibling;
		}
		else {
			return null;
		}
	}

	processNode(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes, id, annotation, containerid) {
		if (currentNode === null || currentNode.id === containerid) {
			return null;
		}	
		if (currentNode.nodeType === TEXT_NODE) {
			return this.processTextNode(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes, id, annotation, containerid);
		}
		else if (currentNode.nodeType === ELEMENT_NODE) {
			var modified = document.createElement("span");
			modified.setAttribute("class", currentNode.getAttribute("class"))
			modified.setAttribute("style", currentNode.getAttribute("style"))
			for (var child of currentNode.childNodes){
				var processedChildren = this.processNode(child, anchor, sel, selectionLength, styleAttr, modifiedNodes, id, annotation, containerid);
				for (var processedChild of processedChildren){
					modified.appendChild(processedChild);
				}
				selectionLength -= child.textContent;
			}
			return [modified];
		}
		return null;
	}

	processTextNode = function(currentNode, anchor, sel, selectionLength, styleAttr, modifiedNodes, id, annotation, containerid) {
		var start = 0;
		if (currentNode === anchor) {
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
		if (currentNode === anchor){
			var before = document.createTextNode(currentNode.nodeValue.slice(0, start));
			subsections.push(before);
		}

		var modified = document.createElement("span");
		modified.classList.add("annotated");
		modified.classList.add(id);

		this.loadParentClasses(modified, currentNode, id, containerid);

		modified.setAttribute("style",styleAttr);
		modified.appendChild(document.createTextNode(currentNode.nodeValue.slice(start, end)));
		modifiedNodes.push(modified);

		modified.addEventListener("click", function(e){
			window.alert(annotation.description);
		});
		
		modified.addEventListener("mouseover", function(e){
			var sameAnnotation = document.getElementsByClassName(""+id);
			for (var i=0; i<sameAnnotation.length; i++){
				sameAnnotation[i].style.setProperty('color','blue','important');
			}
		});
		modified.addEventListener("mouseout", function(e){
			var sameAnnotation = document.getElementsByClassName(id);
			for (var i=0; i<sameAnnotation.length; i++){
				sameAnnotation[i].style.color = 'red';
			}
		});

		var after = document.createTextNode(currentNode.nodeValue.slice(end));
	
		subsections = subsections.concat([modified, after]);
		return subsections
	}

	loadParentClasses(newNode, currentNode, id, containerid) {
		var ancestor = currentNode.parentNode;
		while (ancestor.id !== containerid){
			console.log(ancestor);
			for (var i=0; i<ancestor.classList.length; i++){
				newNode.classList.add(ancestor.classList[i]);
			}
			ancestor = ancestor.parentNode;
		}
	}

	render() {
		var modals = [];
		for (var i=0; i<this.state.ANNOTATIONS.length; i++){
			var current = <AnnotationModal desc={this.state.ANNOTATIONS[i].description}></AnnotationModal>
			modals.push(current);
		}
		return 	(
			<div>
				<div id="textbody" onMouseUp={this.handleMouseUp}>
					01234 67890123 56 890 2345678 0123 5678 01 3456 8901 345 789012
				</div>
				<div>
					{ modals }
				</div>
			</div>
		);
	}
}