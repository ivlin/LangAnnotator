import React, { ReactElement, FunctionComponent, useRef, useState, useCallback, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { getAnnotationKey } from '../utils/KeyGlobals';

export enum Color {
	Red = "#e88",
	Orange = "#c64",
	Yellow = "#ec5",
	Green = "#7a5",
	Blue = "#48f",
	Teal = "#6ab",
	Violet = "#99e",
	Pink = "#e9d", 
	Brown = "#b85",
	White = "#fff"
}

type AnnotationSubscriber = (color: Color, height: number, label: string) => void;

export function useAnnotationState(annotation: Annotation): [Color, number, string, AnnotationSubscriber] {	
	const [colorState, setColorState] = useState("");
	const [labelState, setLabelState] = useState("");
	
	function refreshHook(color: Color, _height: number, label: string) {
		console.log("refreshhook")
		setColorState(color);
		setLabelState(label);
	}

	useEffect(() => {
		annotation.subscribe(refreshHook);
		return () => { annotation.unsubscribe(refreshHook); };
	});

	function setAnnotationState(annotationClass: Color, annotationHeight: number, label: string): void {
		annotation.setAnnotationState(annotationClass, annotationHeight, label);
	}

	return [annotation.annotationClass, 
		annotation.annotationHeight, 
		annotation.label, 
		setAnnotationState];
}

export class Annotation {
	label: string;
	comment: string;
	annotationClass: Color;
	subscribers: Array<AnnotationSubscriber>;
	key: string;
	annotationHeight: number;

	constructor(annotationClass: Color, annotationHeight: number, label: string, comment?: string) {
		this.annotationClass = annotationClass;
		this.annotationHeight = annotationHeight;
		this.key = getAnnotationKey();
		this.label = label ? label : "Title";
		this.comment = comment ? comment : "";
		this.subscribers = new Array<AnnotationSubscriber>();
	}

	subscribe(fn: AnnotationSubscriber) {
		this.subscribers.push(fn);
	}

	unsubscribe(fn: AnnotationSubscriber) {
		this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
	}

	setAnnotationState(annotationClass: Color, annotationHeight: number, label: string): void {
		this.annotationClass = annotationClass;
		this.label = label;
		this.annotationHeight = annotationHeight;
		console.log("Updating annotation state", this.annotationClass, this.label)
		this.subscribers.forEach((fn: AnnotationSubscriber) => fn(this.annotationClass, this.annotationHeight, this.label));
	}
}

export interface MarkableTextItem {
	key: string,
	content: string,
	annotations: Annotation[],
}

type MarkableTextElementProps = {
	data: MarkableTextItem,
	editMode: boolean,
	highlightHandler: () => void,
	openAnnotationCallback: (annotations: Annotation[]) => void
}

export const MarkableTextElement: FunctionComponent<MarkableTextElementProps> = (props) => {
	const { data, editMode, highlightHandler, openAnnotationCallback } = props;
	// Free-text edit
	const inputCallback = (ev: React.SyntheticEvent) => {
		data.content = (ev.target as HTMLInputElement).innerText
	};

	const hoverCallback = (ev: React.SyntheticEvent) => {
		(ev.target as HTMLInputElement).style.color = data.annotations[0].annotationClass;
		openAnnotationCallback(data.annotations.slice(0, data.annotations.length - 1));
	};

	const [annotationClass, annotationHeight, _, __] = useAnnotationState(data.annotations[0]);

	const content = <span contentEditable={editMode} suppressContentEditableWarning={true}
				data-key={data.key} onInput={inputCallback} onPointerUp={ highlightHandler } onClick={hoverCallback}
				className="markableTextElement" style={{ color: annotationClass, lineHeight: 1.5 }}>
		{ data.content }
	</span>;

	return (<RecursiveMarkedText annotations={ data.annotations } content={ content } />);
}

type RecursiveMarkedTextProps = {
	level?: number,
	annotations: Annotation[],
	content: ReactElement,
}

const RecursiveMarkedText: FunctionComponent<RecursiveMarkedTextProps> = (props) => {
	const { level, annotations, content } = props;
	const annotationIndex = level ? level : annotations.length;
	const [hover, setHover] = useState(false);
	const hoverUpdateCallback = useCallback((hover: boolean) => { setHover(hover) }, [hover]);

	if (annotationIndex === 1) { 
		return <span>{ content }</span>;
	}
	const inverseAnnotationIndex = annotations.length - annotationIndex;
	const annotationColor = annotations[inverseAnnotationIndex].annotationClass;
	
	return <span className="annotationWrapper" 
				onMouseEnter={() => { hoverUpdateCallback(true) }} 
				onMouseLeave={() => { hoverUpdateCallback(false) }} 
				onMouseUp={ () => { hoverUpdateCallback(false) }}
		style={{ 
			borderBottom: "2px solid", 
			backgroundColor: hover ? annotationColor : "transparent",
			paddingBottom: `${(annotations[inverseAnnotationIndex].annotationHeight - 1)* 3}px`, 
			borderBottomColor: annotationColor,}}> 
		{ <RecursiveMarkedText annotations={annotations} level={annotationIndex - 1} content={content}/> }
	</span>;
}