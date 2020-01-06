document.getElementById("textbody").addEventListener("mouseup", function(e){
	mouseUpResponse();
});

var existingSelections = [];

function mouseUpResponse() {
	if (document.getSelection) {    // all browsers, except IE before version 9
		sel = document.getSelection();
        //console.log(getDepth(sel.anchorNode));
        styleSelection(sel);
        console.log(sel);
  	}
}

var styleSelection = function(sel) {
	var anchor = sel.anchorNode;
	var selectionText = sel.toString();

	var depth = getDepth(anchor);
	var styleAttr = `color:red; line-height: ${20+depth}px; padding-bottom: ${4*depth}px;`;


	var updatedNode = anchor.nodeValue.slice(0,sel.anchorOffset) + 
						`<span class='annotated' style='${styleAttr}'>` + selectionText + "</span>" + 
						anchor.nodeValue.slice(sel.anchorOffset + selectionText.length);

	var updatedInnerHTML = "";
	var overflow = 0;

	var siblingNodes = anchor.parentElement.childNodes;
	for (var i=0; i<siblingNodes.length; i++) {
		if (siblingNodes[i] == anchor){
			updatedInnerHTML += updatedNode; 
			if (sel.anchorOffset + selectionText.length > siblingNodes[i].length){
				overflow = sel.anchorOffset + selectionText.length - siblingNodes[i].length;
			}
		}
		else{
			// outerHTML supported for Firefox 11+
			updatedInnerHTML += siblingNodes[i].nodeType == 1 ? siblingNodes[i].outerHTML : siblingNodes[i].nodeValue;
		}
	} 
	anchor.parentElement.innerHTML = updatedInnerHTML;
}

var getDepth = function(node) {
	var depth;
	for (depth = 0; !node.parentElement.id || node.parentElement.id != "textbody"; node=node.parentElement, depth++);
	return depth
}