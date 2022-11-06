import React, { FunctionComponent, useCallback } from 'react';
import { MarkableTextElement, MarkableTextItem } from './MarkableTextElement';

type TextDisplayProps = {
	content: MarkableTextItem[],
	editMode: boolean,
	highlightCallback: () => void
}

export const TextDisplay: FunctionComponent<TextDisplayProps> = (props) => {
	const { content, highlightCallback, editMode } = props;

	return <div style={{width: "95%", textAlign: "left", paddingLeft: "5px", 
					margin: "5px", whiteSpace: "pre-line"}}>
		{
			content.map((dataEl, ind) => 
				<MarkableTextElement key={dataEl.key} data={dataEl} editMode={editMode} highlightHandler={highlightCallback} />)
		}
	</div>;
}
