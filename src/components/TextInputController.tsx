import 'font-awesome/css/font-awesome.min.css';
import React, { FunctionComponent, useCallback, useRef } from 'react';

type TextInputControllerProp = {
	appendHandler: (suffix: string) => void,
}

export const TextInputController: FunctionComponent<TextInputControllerProp> = (props) => {
	const { appendHandler } = props;
	const inputRef = useRef(null);
	const submitCallback = (event: React.FormEvent) => {
		event.preventDefault();
		const input = inputRef.current as unknown as HTMLInputElement;
		appendHandler(input.value);
		input.value = "";
	};

	return (
		<div className="topnav">
			<form className="appendContainer">
				<input type="text" autoFocus ref={inputRef} placeholder={"Append new notes or edit existing ones directly below"} />
				<button className="button" type="submit" onClick={submitCallback}><i className="fa fa-arrow-right fa-lg"></i></button>
			</form>
		</div>
		);		
}