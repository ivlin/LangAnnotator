import React, { FunctionComponent, useRef, useState, useCallback, useEffect } from 'react';

import { getAnnotationKey } from '../utils/KeyGlobals';

export enum Color {
	Red = "#e88", //red
	Orange = "#ec5", //orange
	Green = "#7a5", //green
	Blue = "#48f", //blue
	Violet = "#99e", //violet
	Pink = "#e9d", //pink
	White = "#fff" //white
}

type AnnotationSubscriber = (color: Color) => void;

//React.Dispatch<React.SetStateAction<Color>>
export function useAnnotationClass(annotation: Annotation): [Color, (color: Color) => void] {	
	const [hookState, setHookState] = useState("");
	
	function refreshHook(color: Color) {
		setHookState(color);
	}

	useEffect(() => {
		console.log(annotation);
		annotation.subscribe(refreshHook);
		return () => { annotation.unsubscribe(refreshHook); };
	});

	function setAnnotationClass(annotationClass: Color): void {
		annotation.setAnnotationClass(annotationClass);
	}

	return [annotation.annotationClass, setAnnotationClass];
}

export class Annotation {
	comment: string;
	annotationClass: Color;
	subscribers: Array<AnnotationSubscriber>;
	key: string;

	constructor(annotationClass: Color, comment?: string) {
		this.annotationClass = annotationClass;
		this.key = getAnnotationKey();
		this.comment = comment ? comment : "";
		this.subscribers = new Array<AnnotationSubscriber>();
	}

	subscribe(fn: AnnotationSubscriber) {
		this.subscribers.push(fn);
	}

	unsubscribe(fn: AnnotationSubscriber) {
		this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
	}

	setAnnotationClass(annotationClass: Color): void {
		this.annotationClass = annotationClass;
		this.subscribers.forEach((fn: AnnotationSubscriber) => fn(this.annotationClass));
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
}

export const MarkableTextElement: FunctionComponent<MarkableTextElementProps> = (props) => {
	const { data, editMode, highlightHandler } = props;
	// Free-text edit
	const inputCallback = (ev: React.SyntheticEvent) => {
		data.content = (ev.target as HTMLInputElement).innerText
	};

	const hoverCallback = (ev: React.SyntheticEvent) => {
		(ev.target as HTMLInputElement).style.color = data.annotations[0].annotationClass;
	};

	const [annotationClass, _] = useAnnotationClass(data.annotations[0]);

	return (<span contentEditable={editMode} suppressContentEditableWarning={true}
				data-key={data.key} onMouseUp={highlightHandler} onInput={inputCallback} onClick={hoverCallback}
				style={{ color: annotationClass }}>
		{ data.content }
	</span>);
}