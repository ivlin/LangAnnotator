import 'font-awesome/css/font-awesome.min.css';
import React, { FunctionComponent, useCallback, useRef } from 'react';

type TextInputControllerProp = {
	appendHandler: (suffix: string) => void,
	editMode: boolean,
	toggleEditModeHandler: () => void,
	toggleConfigModal: () => void,
	toggleHelpModal: () => void
}

export const TextInputController: FunctionComponent<TextInputControllerProp> = (props) => {
	const { appendHandler, editMode, toggleEditModeHandler, toggleConfigModal, toggleHelpModal } = props;
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
				<input type="text" ref={inputRef} placeholder={"Append new notes or edit existing ones directly below"} />
				<button className="button" type="submit" onClick={submitCallback}><i className="fa fa-plus fa-lg"></i></button>
			</form>
			<div className="optionListContainer">
				<button className={editMode ? "button" : "button active"} onClick={toggleEditModeHandler}><i className="fa fa-magic fa-lg"></i></button>
				<button className={editMode ? "button active" : "button"} onClick={toggleEditModeHandler}><i className="fa fa-edit fa-lg"></i></button>
				<button className="button" onClick={toggleConfigModal}><i className="fa fa-cog fa-lg"></i></button>
				<button className="button" onClick={toggleHelpModal}><i className="fa fa-question fa-lg"></i></button>
			</div>
		</div>
		);		
}