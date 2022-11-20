import React, { FunctionComponent, useCallback } from 'react';
import { Annotation, MarkableTextElement, MarkableTextItem } from './MarkableTextElement';

type TextDisplayProps = {
	content: MarkableTextItem[],
	editMode: boolean,
	highlightCallback: () => void,
	openAnnotationCallback: (annotations: Annotation[]) => void
}

export const TextDisplay: FunctionComponent<TextDisplayProps> = (props) => {
	const { content, highlightCallback, editMode, openAnnotationCallback } = props;

	return <div style={{width: "95%", textAlign: "left", paddingLeft: "5px", 
					margin: "5px", whiteSpace: "pre-line"}}>
		{
			content.map((dataEl, ind) => 
				<MarkableTextElement key={dataEl.key} data={dataEl} editMode={editMode} 
				openAnnotationCallback={openAnnotationCallback} highlightHandler={highlightCallback} />)
		}
	</div>;
}
