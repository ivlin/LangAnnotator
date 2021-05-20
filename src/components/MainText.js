import React from 'react';
import Sidebar from 'react-sidebar';
import { FaBars, FaTrash, FaChevronCircleDown, FaChevronCircleUp, FaCog, FaCogs, FaPaintBrush } from 'react-icons/fa';

import Annotation from './Annotation'
import AnnotationButton from './AnnotationButton'
import SummaryPage from './SummaryPage'

const colors = [
	"#e88", //red
	"#ec5", //orange
	"#7a5", //green
	"#48f", //blue
	"#99e", //violet
	"#e9d" //pink
]

export default class MainText extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ANNOTATIONS: [],
			annotation_id: 1,
			maxDepth: 0,
			defaultColorInd: 0,
			text: "",
			textPanes: [],
			isShowHelp: true,
			isShowImport: false, 
			isShowImportAnnotations: false,
			isShowExportAnnotations: false,
			isShowSummary: false,
			isAutoEditMode: true
		};

		this.handleAutoAnnotate = this.handleAutoAnnotate.bind(this);
		this.handleAnnotate = this.handleAnnotate.bind(this);
		this.handleRerender = this.handleRerender.bind(this);
		this.handleAppend = this.handleAppend.bind(this);
		this.handleAppendEnter = this.handleAppendEnter.bind(this);
		this.handleClear = this.handleClear.bind(this);
		this.handleDeleteAnnotation = this.handleDeleteAnnotation.bind(this);
		this.handleDefaultColor = this.handleDefaultColor.bind(this);

		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		this.handleExample = this.handleExample.bind(this);
		this.handleShowImport = this.handleShowImport.bind(this);
		this.handleImportAppend = this.handleImportAppend.bind(this);
		this.handleImportReplace = this.handleImportReplace.bind(this);
		this.handleShowHelp = this.handleShowHelp.bind(this);
	
		this.handleShowExportAnnotations = this.handleShowExportAnnotations.bind(this);
		this.handleShowImportAnnotations = this.handleShowImportAnnotations.bind(this);
		this.handleImportAnnotations = this.handleImportAnnotations.bind(this);
		this.handleImportFileAnnotations = this.handleImportFileAnnotations.bind(this);
		this.handleStartFileUpload = this.handleStartFileUpload.bind(this);
		this.handleSummarizeAnnotations = this.handleSummarizeAnnotations.bind(this);
		this.handleEditMode = this.handleEditMode.bind(this);
	}

	handleEditMode() {
		this.setState({ isAutoEditMode: !this.state.isAutoEditMode })
	}

	handleRerender(ann, color) { // update colors
		this.reloadTextPanes(this.state.textPanes, ann, color);
	}

	handleDeleteAnnotation(ann) {
		var index = -1;
		for (var i = 0; i < this.state.textPanes.length; i++){
			if (this.state.textPanes[i].props && this.state.textPanes[i].props.annotation === ann.props.annotation) {
				index = i;
			}
		}
		if (index > -1) {
			this.state.textPanes.splice.apply(this.state.textPanes, [index, 1].concat(ann.props.children));
			this.setState(this.state)
		}
	}

	reloadTextPanes(pane_list, ann, color) {
		for (var i=0; i<pane_list.length; i++){
			if (pane_list[i].props && pane_list[i].props.children) {
				//reload children
				var modified_children = pane_list[i].props.children;
				if (!Array.isArray(modified_children)){
					modified_children = [modified_children];
				}
				this.reloadTextPanes(modified_children, ann, color);

				pane_list[i] =
					<AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ pane_list[i].key }
						depth={ pane_list[i].props.depth }
						annotation={ pane_list[i].props.annotation }
						color={ pane_list[i].props.annotation===ann ? color : pane_list[i].props.annotation.color } >
						{ modified_children }
					</AnnotationButton>;
			}
		}
		this.setState(this.state);
	}

	handleAutoAnnotate(e) {
		if (this.state.isAutoEditMode) {
			this.handleAnnotate(e);
		}
	}

	handleAnnotate(e) {
		console.log("ANNOTATING");
		if (document.getElementsByClassName("modal").length){
			return;
		}
		console.log(document.getSelection());
		console.log(document.getSelection().toString());
		if (document.getSelection() && document.getSelection().toString().length>0) {    // all browsers, except IE before version 9
			var sel = document.getSelection();
        	var input = this.getUserInput();
        	if (!input){
        		return
        	}
			console.log(input);
        	var annotation = new Annotation();
        	annotation.description = input;
        	annotation.selection = sel.toString();
        	annotation.color = colors[this.state.defaultColorInd];
        	this.styleSelection(sel, annotation, "textbody");
        	sel.empty();
  		}
	}

	getUserInput() {
		console.log("GETTING USER INPUT");
		return window.prompt("What is this annotation for?","");
	}

	styleSelection(sel, annotation, containerid) {
		annotation.id = this.state.annotation_id;
		annotation.startIndex = this.getTotalOffset(sel.anchorNode, sel.anchorOffset, containerid);
		annotation.endIndex = this.getTotalOffset(sel.focusNode, sel.focusOffset, containerid);

		if (annotation.startIndex > annotation.endIndex) {
			var temp = annotation.startIndex;
			annotation.startIndex = annotation.endIndex;
			annotation.endIndex = temp;
		}

		var depth = this.getDepthRange(annotation);
		annotation.depth = depth;
		this.setState({ maxDepth: Math.max(this.state.maxDepth, depth) });

		//no modification necessary
		var updatedtextPanes = []
		var startInd = 0;
		var endInd = this.state.text.length;

		for (var i=0; i<this.state.textPanes.length; i++){
			if (typeof this.state.textPanes[i] === 'string' || this.state.textPanes[i] instanceof String) {
				endInd = startInd + this.state.textPanes[i].length;
			}
			else if (this.state.textPanes[i].type==='br') {
				endInd = startInd; //while it is treated as \n in text, it doesn't count as a valid reduction of length
			}
			else {
				endInd = this.state.textPanes[i].props.annotation.endIndex;
			}
			var x = this.processAnnotation(annotation, this.state.textPanes[i], startInd, endInd);
			updatedtextPanes=updatedtextPanes.concat(x);
			startInd = endInd;
		}

		this.setState({textPanes: updatedtextPanes});
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
		var escaped = /(\t|\r)+/;
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

			//Base case - String

			if (typeof prev_annotation === 'string' || prev_annotation instanceof String){
				var startHighlight = new_annotation.startIndex > prev_start ? new_annotation.startIndex - prev_start : 0;
				var prev_len = prev_end - prev_start;
				var endHighlight = new_annotation.endIndex > prev_end ? prev_len : prev_len - (prev_end - new_annotation.endIndex);

				new_annotation.color = colors[this.state.defaultColorInd];

				return [prev_annotation.slice(0,startHighlight),
						<AnnotationButton
							updater={ this.handleRerender }
							deleter={ this.handleDeleteAnnotation }
							key={ parseInt("" + new_annotation.id + prev_start + prev_end) }
							depth={ new_annotation.depth }
							annotation={ new_annotation }
							color={ new_annotation.color } >
							{prev_annotation.slice(startHighlight,endHighlight)}
						</AnnotationButton>,
						prev_annotation.slice(endHighlight)]
			}
			else if (prev_annotation.type==='br') {
				return [<br key={ prev_annotation.key }></br>]
			}

			//Recurse
			var prev_children = prev_annotation.props.children;
			if (!Array.isArray(prev_children)){
				prev_children = [prev_children];
			}
			var modified_children = [];
			for (var i=0; i<prev_children.length; i++){
				prev_end = (typeof prev_children[i] === 'string' || prev_children[i] instanceof String) ?
					prev_start + prev_children[i].length : prev_children[i].props.annotation.endIndex;

				modified_children = modified_children.concat(this.processAnnotation(new_annotation, prev_children[i], prev_start, prev_end));

				prev_start = prev_end;
			}

			return [<AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ parseInt("" + new_annotation.id + prev_start + prev_end) }
						depth={ prev_annotation.props.depth }
						annotation={ prev_annotation.props.annotation }
						color={ prev_annotation.props.annotation.color }>
						{ modified_children }
					</AnnotationButton>];
		}
		else {
			return prev_annotation;
		}
	}

	handleAppend() {
		var newPanes = this.state.textPanes;
		newPanes.push("" + document.getElementById("append-text").value);
		newPanes.push(<br key={ parseInt("" + -1 + this.state.text.length + this.state.text.length) }></br>);
		this.setState({ textPanes : newPanes, text : this.state.text + "\n" + document.getElementById("append-text").value})
		document.getElementById("append-text").value = "";
	}

	handleAppendEnter(e) {
		if (e.key === "Enter") {
			this.handleAppend();
		}
	}

	handleDefaultColor() {
		this.setState({ defaultColorInd: (this.state.defaultColorInd + 1) % colors.length })
	}

	handleImportReplace() {
		var newPanes = [];
		newPanes.push("" + document.getElementById("import-text").value);
		newPanes.push(<br key={ parseInt("" + -1 + this.state.text.length + this.state.text.length) }></br>);
		this.setState({
			ANNOTATIONS: [],
			annotation_id: 1,
			maxDepth: 0,
			text: "",
			textPanes: newPanes
		});
		document.getElementById("import-text").value = "";
	}
	
	handleImportAppend() {
		var newPanes = this.state.textPanes;
		newPanes.push("" + document.getElementById("import-text").value);
		newPanes.push(<br key={ parseInt("" + -1 + this.state.text.length + this.state.text.length) }></br>);
		this.setState({ textPanes : newPanes, text : this.state.text + "\n" + document.getElementById("import-text").value})
		document.getElementById("import-text").value = "";
	}

	handleClear() {
		this.setState({
				ANNOTATIONS: [],
				annotation_id: 1,
				keys: 1,
				maxDepth: 0,
				text: "",
				textPanes: []
			});
	}

	onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open })
	}

	render() {
		var textbody = (
			<div>
				{ this.state.isShowSummary && 
					<SummaryPage toggler={ this.handleSummarizeAnnotations } annotations={this.state.ANNOTATIONS}></SummaryPage> }
				<div id="textbody" onMouseUp={this.handleAutoAnnotate}>
					{ this.state.textPanes }
				</div>
			</div>
		);

		var sidebarContent =
			<div className="sideNav">
				<p className="menuItem"  onClick={ this.handleExample }> Example </p>
				<p className="menuItem"  onClick={ this.handleSummarizeAnnotations }> Annotations </p>
				<p className="menuItem"  onClick={ this.handleShowImport }> Bulk Plaintext { this.state.isShowImport ? <FaChevronCircleUp/> : <FaChevronCircleDown/> }</p>
				{
					this.state.isShowImport &&
					<div>
						<textarea id="import-text" style={ {width:"100%", fontSize: "0.75em", height:"12em"} } placeholder="Enter text to input.">
						</textarea>
						<button style={ {width:"50%", fontSize: "0.75em"} } onClick={this.handleImportReplace} type="button">Replace</button>
						<button style={ {width:"50%", fontSize: "0.75em"} } onClick={this.handleImportAppend} type="button">Append</button>
					</div>
				}
				<p className="menuItem"  onClick={ this.handleShowExportAnnotations }> Export Annotations { this.state.isShowExportAnnotations ? <FaChevronCircleUp/> : <FaChevronCircleDown/> }</p>
				{
					 this.state.isShowExportAnnotations &&
					<div>
						<textarea id="export-annotations" style={ {width:"100%", fontSize: "0.75em", height:"12em"} } readOnly value={ Buffer.from(JSON.stringify(this.state)).toString("base64") }>
						</textarea>
						<a href={ 'data:text/plain;charset=utf-8,' + Buffer.from(JSON.stringify(this.state)).toString("base64") } download={ "LangAnnotator.txt" }>
							<button style={ {width:"100%", fontSize: "0.75em"} } type="button">Save as File</button>
						</a>
					</div>
				}
				<p className="menuItem"  onClick={ this.handleShowImportAnnotations }> Import Annotations { this.state.isShowImportAnnotations ? <FaChevronCircleUp/> : <FaChevronCircleDown/> } </p>
				{
					 this.state.isShowImportAnnotations &&
					<div>
						<textarea id="import-annotations" style={ {width:"100%", fontSize: "0.75em", height:"12em"} }>
						</textarea>
						<div style={ { display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "row" } }>
							<button style={ {width:"50%", fontSize: "0.75em"} } onClick={this.handleImportAnnotations} type="button">Load</button>
							<button style={ {width:"50%", fontSize: "0.75em"} } onClick={this.handleStartFileUpload} type="button">File Import</button>
						</div>
						<input type="file" id="annotationFileInput" className="annotationImport" onChange={(e) => this.handleImportFileAnnotations(e)} />
					</div>
				}
				<p className="menuItem"  onClick={ this.handleShowHelp }> Help { this.state.isShowHelp ? <FaChevronCircleUp/> : <FaChevronCircleDown/> }</p>
				{ 
					this.state.isShowHelp &&
					<div style={{fontSize: "0.75em", padding: "0 0.25em"}}>
					<p>
						<b>Highlight</b> a part of the text to add an annotation. When in automatic mode, highlighting automatically creates an annotation dialog. When in manual mode, use the brush button at the bottom left to create the annotation for the highlighted text.
					</p>
					<p>
						<b>Click</b> an annotation to view it or modify it.
					</p>
					<p>
						Use the top <b>Append</b> bar to add another line to the main text body. Use the <b>Import Plaintext</b> option to append large blocks of text.
					</p>
					<p>
						Click on the <b>trash can</b> to clear the body of text.
					</p>
					<p> 
						Save the state of your notebook from <b>Export Annotations</b> and reload it using <b>Import Annotations</b>.
					</p>
				</div>}
			</div>

	    return (
	    		<Sidebar sidebar={ sidebarContent }
			        	open={this.state.sidebarOpen}
			        	onSetOpen={this.onSetSidebarOpen}
			        	styles={{ sidebar: { background: "white", width: "25%" } }}>
     				<div className="topNav">
	     				<div className="menuBar">
		     				<button style={{ minHeight: "2em" }} onClick={() => this.onSetSidebarOpen(true)}>
	    	     				<FaBars/>
	        				</button>
	        				<span>
	        					LangAnnotator
	        				</span>
			    		</div>
						<div className="nav-append">
							<input type="text" id="append-text" onKeyUp={ this.handleAppendEnter }></input>
							<span className="dot-bg">
								<span className="dot" style={{ backgroundColor: colors[this.state.defaultColorInd] }} onClick={this.handleDefaultColor}></span>
							</span>
							<button onClick={this.handleAppend} type="button">Append</button>
							<button onClick={this.handleClear} type="button"><FaTrash/></button>
						</div>
					</div>
					<div style={{ visibility: "hidden" }}>
	     				<div className="menuBar">
		     				<button style={{ minHeight: "2em" }} onClick={() => this.onSetSidebarOpen(true)}>
	    	     				<FaBars/>
	        				</button>
	        				<span>
	        					LangAnnotator
	        				</span>
			    		</div>
						<div className="nav-append">
							<input type="text" id="append-teaxt" onKeyUp={ this.handleAppendEnter }></input>
							<button onClick={this.handleAppend} type="button">Append</button>
							<button onClick={this.handleClear} type="button"><FaTrash/></button>
						</div>
					</div>
		    		{ textbody }
		    		{ this.state.isAutoEditMode ?
						<div className="float-option" onClick={ this.handleEditMode } style={{bottom:"40px", right:"40px"}} >
							<div className="float-option-icon">
								<FaCog/>
							</div>
							<br/>
						</div> :
						<div>
						// Some browsers reset selections on click
						<div className="float-option" onMouseDown={ this.handleAnnotate } style={{bottom:"120px", right:"40px"}} >
							<div className="float-option-icon">
								<FaPaintBrush/>
							</div>
						</div>
						<div className="float-option" onClick={ this.handleEditMode } style={{ bottom:"40px", right:"40px"}} >
							<div className="float-option-icon">
								<FaCogs/>
							</div>
						</div>
						</div>
					}
	    		</Sidebar>
	    	);
	}

	handleExample() {
		var a1 = new Annotation(1, 18, 26, "cambiar - verb\nto change", "cambiar");
		a1.id = 1;
		a1.color = colors[1];
		var a2 = new Annotation(1, 42, 46, "emos/amos indicates that the pronoun is \"us\"", "emos");
		a2.id = 2;
		a2.color = colors[0];
		var a3 = new Annotation(1, 99, 105, "cambiar", "change");
		a3.id = 3;
		a3.color = colors[1];
		var a4 = new Annotation(1, 146, 162, "Guatemalan activist and Nobel Peace prize winner", "Rigoberta Menchu");
		a4.id = 4;
		a4.color = colors[3];

		this.setState({
			ANNOTATIONS: [a1, a2, a3, a4],
			annotation_id: 5,
			maxDepth: 1,
			text: "Este mundo no va a cambiar a menos que estemos dispuestos a cambiar nosotros mismos\nThe world won't change unless we're willing to change ourselves\nRigoberta Menchu",
			textPanes:
				["Este mundo no va a ",
				<AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ parseInt("" + a1.id + a1.startIndex + a1.endIndex) }
						depth={ a1.depth }
						annotation={ a1 }
						color={ a1.color }>
						cambiar
					</AnnotationButton>,
				" a menos que est",
				<AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ parseInt("" + a2.id + a2.startIndex + a2.endIndex) }
						depth={ a2.depth }
						annotation={ a2 }
						color={ a2.color }>
						emos
					</AnnotationButton>,
				" dispuestos a cambiar nosotros mismos",
				<br key={1}></br>,
				"The world won't ",
				<AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ parseInt("" + a3.id + a3.startIndex + a3.endIndex) }
						depth={ a3.depth }
						annotation={ a3 }
						color={ a3.color }>
						change
					</AnnotationButton>,
				 " unless we're willing to change ourselves",
				 <br key={2}></br>,
				 "",
				 <AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ parseInt("" + a4.id + a4.startIndex + a4.endIndex) }
						depth={ a4.depth }
						annotation={ a4 }
						color={ a4.color }>
						Rigoberta Menchu
					</AnnotationButton>,
				 "",
				 <br key={3}></br>]
		});
		this.setState();
	}

	handleShowHelp() {
		this.setState({ isShowHelp: !this.state.isShowHelp });
	}

	handleShowImport() {
		this.setState({ isShowImport: !this.state.isShowImport });
	}

	handleShowImportAnnotations() {
		this.setState({ isShowImportAnnotations: !this.state.isShowImportAnnotations });
	}

	handleShowExportAnnotations() {
		this.setState({ isShowExportAnnotations: !this.state.isShowExportAnnotations });
	}

	handleImportAnnotations() {
		let encodedAnnotations = document.getElementById("import-annotations").value;
		var annotations = JSON.parse(Buffer.from(encodedAnnotations, "base64").toString("utf-8"));
		annotations.ANNOTATIONS = this.regenerateAnnotations(annotations.ANNOTATIONS);
		annotations.textPanes = this.regenerateTextPanes(annotations.textPanes, annotations.ANNOTATIONS);
		this.setState(annotations);
	}

	handleImportFileAnnotations = async (e) => {
		e.preventDefault()
		const reader = new FileReader()
		reader.onload = async (e) => { 
	    	const text = (e.target.result);
	    	document.getElementById("import-annotations").value = text;
	    };
	    reader.readAsText(e.target.files[0]);
	}

	handleStartFileUpload() {
		document.getElementById("annotationFileInput").click();
	}

	handleSummarizeAnnotations() {
		this.setState({isShowSummary: !this.state.isShowSummary});
	}

	regenerateAnnotations(annotations) {
		var regenerated = []
		for (let annotation of annotations){
			let temp = new Annotation(annotation._depth, annotation._start, annotation._end, annotation._description, 
				annotation._selection !== "" ? annotation._selection : annotation._description.slice(0, annotation._description.indexOf(" ")));
			temp.id = annotation._id; 
			temp.color = annotation._color;
			regenerated.push(temp)
		}
		return regenerated;
	}

	regenerateTextPanes(annotations, ann_refs) {
		var regenerated = [];
		for (let annotation of annotations){
			if (typeof annotation === 'string' || annotation instanceof String) {
				regenerated.push(annotation);
			}
			else if (annotation.type === "br") {
				regenerated.push(<br key={ annotation.key }></br>);
			}
			else {
				regenerated.push(
					<AnnotationButton
						updater={ this.handleRerender }
						deleter={ this.handleDeleteAnnotation }
						key={ annotation.key }
						depth={ annotation.props.depth }
						annotation={ ann_refs[annotation.props.annotation._id - 1] }
						color={ annotation.props.annotation.color }>
						{ Array.isArray(annotation.props.children) ? 
							this.regenerateTextPanes(annotation.props.children, ann_refs) :
							this.regenerateTextPanes([annotation.props.children], ann_refs)[0] }
					</AnnotationButton>);
			}
		}
		return regenerated;
	}
}