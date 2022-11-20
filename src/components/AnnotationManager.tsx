import React, { FunctionComponent, useState, useCallback } from 'react';
import { useKeyPress } from './ShortcutHandler';
import { Color, Annotation, useAnnotationState } from './MarkableTextElement';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

type ColorPaletteProps = {
	updateHandler: (color: Color) => void,
	selected: Color
}

const ColorPalette: FunctionComponent<ColorPaletteProps> = (props) => {
	const { updateHandler, selected } = props;
	return <> 
		{Object.values(Color).filter(color => color !== Color.White).map(
			(color) => <button key={color} 
			className={selected === color ? "colorButton colorPaletteOption active" : "colorButton colorPaletteOption"}
			style={{backgroundColor: color}} onClick={ () => { updateHandler(color);} }>
  				</button>
		)}
	</>;
}

type AnnotationManagerProps = {
	annotations: Annotation[],
	hideAnnotationHandler: () => void
	deleteHandler: (annotation: Annotation) => void,
}


type AnnotationTabTitleProps = {
	annotation: Annotation,
}

type AnnotationPanelProps = {
	annotation: Annotation,
	hideAnnotationHandler: () => void
	deleteHandler: (annotation: Annotation) => void,
}

export const AnnotationTabTitle: FunctionComponent<AnnotationTabTitleProps> = (props) => {
	const { annotation } = props;
	const [annotationClass, _annotationHeight, _setAnnotationClass] = useAnnotationState(annotation);
	return <button className="colorButton" style={{backgroundColor: annotation.annotationClass}}></button>;
}

export const AnnotationManager: FunctionComponent<AnnotationManagerProps> = (props) => {
	const { annotations, deleteHandler, hideAnnotationHandler } = props;

	useKeyPress(["Escape"], hideAnnotationHandler)

	return (<div className="modalBackground">
				<Tabs>
				<TabList>
					{ annotations.map((ann, ind) => 
						<Tab key={ind}> <AnnotationTabTitle annotation={ann}/> </Tab>) }
				</TabList>
					{ annotations.map((ann, ind) => 
						<TabPanel key={ind}>
							<AnnotationPanel annotation={ann} hideAnnotationHandler={hideAnnotationHandler} deleteHandler={deleteHandler} />
						</TabPanel>
					)}
				</Tabs>
		</div>
	);
}

export const AnnotationPanel: FunctionComponent<AnnotationPanelProps> = (props) => {
	const { annotation, deleteHandler, hideAnnotationHandler } = props;
	const inputCallback = (ev: React.SyntheticEvent) => {
		annotation.comment = (ev.target as HTMLInputElement).innerText;
	};

	const [annotationClass, annotationHeight, setAnnotationState] = useAnnotationState(annotation);
	const setAnnotationClassCallback = useCallback((color: Color) => {
		setAnnotationState(color, annotationHeight);
	}, [annotationClass, annotationHeight]);

	return <div className="annotationManager modalContent">
    			<div onClick={hideAnnotationHandler} className="headerRightItem buttonHighlighting">
  					<i className="fa fa-close"></i>
  				</div>
				<ColorPalette updateHandler={setAnnotationClassCallback} selected={annotationClass} />
  				<br />
				<div style={{border: "1px solid black", whiteSpace: "pre-line"}}
					contentEditable suppressContentEditableWarning onInput={inputCallback}>
					{annotation.comment}
				</div>
				<div className="buttonHighlighting" style={{padding: "15px"}} onClick={() => deleteHandler(annotation)}>
					<i className="fa fa-trash fa-lg"></i>
				</div>
			</div>
}