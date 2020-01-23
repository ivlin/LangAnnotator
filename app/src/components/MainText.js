import React from 'react';
import ReactDOM from 'react-dom';

import AnnotationModal from './AnnotationModal'
import AnnotationButton from './AnnotationButton'
		
class Annotation {
	constructor() {
		this._groups = []
	}
	clone(){
		var clone = new Annotation();
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
			maxDepth: 0,
			text: "01234 67890123 56 890 2345678 0123 5678 01 3456 8901 345 789012",
			annotated_children: ["01234 67890123 56 890 2345678 0123 5678 01 3456 8901 345 789012"],
			ANNOTATION_BTNS: [],
			test: ["01234 67890123 56 890 2345678 0123 5678 01 3456 8901 345 789012"]
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
	
		//no modification necessary
		var updatedTest = []//this.processAnnotation(annotation, this.state.test, 0, this.state.text.length);
		var startInd = 0;
		var endInd = this.state.text.length;
		for (var i=0; i<this.state.test.length; i++){
			if (typeof this.state.test[i] == 'string' || this.state.test[i] instanceof String) {
				endInd = this.state.test[i].length;
			}
			else {
				endInd = this.state.test[i].props.annotation.endIndex;
			}
			var x = this.processAnnotation(annotation, this.state.test[i], startInd, endInd);
			updatedTest=updatedTest.concat(x);
			startInd = endInd;
		}
		
		this.setState({test: updatedTest});
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

	processAnnotation(new_annotation, prev_annotation, prev_start, prev_end){
		//intersects
		if (new_annotation.startIndex < prev_end && prev_start < new_annotation.endIndex) {
			if (typeof prev_annotation == 'string' || prev_annotation instanceof String){				
				var startHighlight = new_annotation.startIndex > prev_start ? new_annotation.startIndex - prev_start : 0;
				var prev_len = prev_end - prev_start;
				var endHighlight = new_annotation.endIndex > prev_end ? prev_len : prev_len - (prev_end - new_annotation.endIndex);
				
				var subAnnotation = new Annotation();
				subAnnotation.id = new_annotation.id;
				subAnnotation.depth = new_annotation.depth;
				subAnnotation.title = new_annotation.title;
				subAnnotation.description = new_annotation.description;
				subAnnotation.startIndex = prev_start + startHighlight;
				subAnnotation.endIndex = prev_start + endHighlight;
				return [prev_annotation.slice(0,startHighlight),
						<AnnotationButton key={ parseInt("" + new_annotation.id + prev_start) }  depth={ new_annotation.depth } annotation={ subAnnotation }>
							{prev_annotation.slice(startHighlight,endHighlight)}
						</AnnotationButton>, 
						prev_annotation.slice(endHighlight)]
			}

			var prev_children = prev_annotation.props.children;
			if (!Array.isArray(prev_children)){
				prev_children = [prev_children];
			}
			var modified_children = [];
			for (var i=0; i<prev_children.length; i++){
				prev_end = (typeof prev_children[i] == 'string' || prev_children[i] instanceof String) ? 
					prev_start + prev_children[i].length : prev_children[i].props.annotation.startIndex;

				modified_children = modified_children.concat(this.processAnnotation(new_annotation, prev_children[i], prev_start, prev_end))
			
				prev_start = prev_end;
			}
			return [<AnnotationButton key={ parseInt("" + new_annotation.id + prev_start) } depth={ prev_annotation.props.depth } annotation={ prev_annotation.props.annotation }>
						{ modified_children }
					</AnnotationButton>];
		}	
		else {
			return prev_annotation;
		}
	}

	render() {
		return (
			<div>
				<div id="textbody" onMouseUp={this.handleMouseUp}>
					{ this.state.test } 
				</div>
				
			</div>
		);
	}
}