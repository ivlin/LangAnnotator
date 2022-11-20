import React, { FunctionComponent, useState, useRef } from 'react';
import { useKeyPress } from './ShortcutHandler';

import { AppState, getAppState, getUrlForString, loadDataFromJson, getContentFromFile } from '../utils/DataExport';

type ConfigModalProps = {
	appState: AppState,
	hideConfigHandler: () => void,
	resetAppState: (appState: AppState) => void
}

export const ConfigModal: FunctionComponent<ConfigModalProps> = (props: ConfigModalProps) => {
	const { hideConfigHandler, appState, resetAppState } = props;
	const downloadLink = getUrlForString(getAppState(appState), "");
	const importRef = useRef(null);
	const submitCallback = (event: React.SyntheticEvent) => {
		const fileList = (event.target as HTMLInputElement).files;
		if (fileList === null) { return; }
		getContentFromFile(fileList[0], (fileContent: string) => {
			resetAppState(loadDataFromJson(fileContent));
			return;
		})
	};

	useKeyPress(["Escape"], hideConfigHandler);

	return (<div className="modalBackground">
			<div className="modalContent">
				<div onClick={hideConfigHandler} className="headerRightItem buttonHighlighting">
  					<i className="fa fa-close"></i>
  				</div>
				<div className="configOptions">
					<div className="configOption"> 
						<a download href={downloadLink}> 
							<i className="fa fa-download fa-lg"></i> 
						</a>
						<div> Export </div>
					</div>
					<div className="configOption">
						<label htmlFor="file-upload" >
						    <i className="fa fa-cloud-upload fa-lg"></i>
						</label>
						<div> Import </div>
						<input style={{display: "none"}} id="file-upload" type="file" onChange={submitCallback} />
					</div>
				</div>
			</div>
		</div>
	);
}