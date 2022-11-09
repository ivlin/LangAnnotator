import React, { FunctionComponent, useCallback } from 'react';

import { Color, Annotation, useAnnotationState } from './MarkableTextElement';

type ColorPaletteProps = {
	updateHandler: (color: Color) => void,
	selected: Color
}

const ColorPalette: FunctionComponent<ColorPaletteProps> = (props) => {
	const { updateHandler, selected } = props;
	return <> 
		{Object.values(Color).filter(color => color !== Color.White).map(
			(color) => <button key={color} 
			className={selected === color ? "colorPaletteOption active" : "colorPaletteOption"}
			style={{backgroundColor: color}} onClick={ () => { updateHandler(color);} }>
  				</button>
		)}
	</>;
}

type AnnotationManagerProps = {
	annotation: Annotation,
	hideAnnotationHandler: () => void
	deleteHandler: (annotation: Annotation) => void,
}

export const AnnotationManager: FunctionComponent<AnnotationManagerProps> = (props) => {
	const { annotation, deleteHandler, hideAnnotationHandler } = props;
	const inputCallback = (ev: React.SyntheticEvent) => {
		annotation.comment = (ev.target as HTMLInputElement).innerText;
	};

	const [annotationClass, annotationHeight, setAnnotationState] = useAnnotationState(annotation);
	const setAnnotationClassCallback = useCallback((color: Color) => {
		setAnnotationState(color, annotationHeight);
	}, [annotationClass, annotationHeight]);

	return (<div style={{
				display: "block", position: "fixed", 
				zIndex: 1, left: "50%", top: "50%", transform: "translate(-50%, -50%)", 
				width: "100%", height: "100%", overflow: "auto", paddingTop: "250px", 
				backgroundColor: "rgba(0,0,0,0.4)"
			}}>
			<div className="annotationManager" style={{
				backgroundColor: "#DDD", margin: "auto",
				padding: "15px", width: "80%", color: "black"
			}}>
				<div>
	    			<span onClick={hideAnnotationHandler} style={{
	    				color: "black", textDecoration: "none", cursor: "pointer", float: "right"
	    			}}>
	  					<i className="fa fa-close"></i>
	  				</span>
  				</div>
				<ColorPalette updateHandler={setAnnotationClassCallback} selected={annotationClass} />
  				<br />
				<div style={{border: "1px solid black", whiteSpace: "pre-line"}}
					contentEditable suppressContentEditableWarning onInput={inputCallback}>
					{annotation.comment}
				</div>
				<div className="button" style={{padding: "15px"}} onClick={() => deleteHandler(annotation)}>
					<i className="fa fa-trash fa-lg"></i>
				</div>
			</div>
		</div>
	);
}