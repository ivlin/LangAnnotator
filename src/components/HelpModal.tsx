import { FunctionComponent } from 'react';
import { useKeyPress } from './ShortcutHandler';

type HelpModalProps = {
	hideHelpHandler: () => void
}

export const HelpModal: FunctionComponent<HelpModalProps> = (props: HelpModalProps) => {
	const { hideHelpHandler } = props;
	useKeyPress(["Escape"], hideHelpHandler);

	return (
		<div className="modalBackground">
				<div className="modalContent">
				<div onClick={hideHelpHandler} className="headerRightItem buttonHighlighting">
  					<i className="fa fa-close"></i>
  				</div>
					<div>
						Help
						<hr />
						<div className="helpTable" style={{ display: "flex", flexDirection: "column"}}>
							<div className="helpTableRow">
								LangAnnotator is a very simple text editor that allows annotating your notes in multiple colors.
							</div>
							<br />
							<div className="helpTableRow">
								<button className="button"><i className="fa fa-magic fa-2x"></i></button>
								Turns on highlight mode. You can highlight text to create new annotations.
							</div>
							<div className="helpTableRow">
								<button className="button"><i className="fa fa-edit fa-2x"></i></button>
								Turns on edit mode. You can directly edit the text in the notes rather than append to the end.
							</div>
							<div className="helpTableRow">
								<button className="button"><i className="fa fa-cog fa-2x"></i></button>
								Launch the config modal. 
								This includes the ability to save the current app state to a file and load from an existing one.
							</div>
						</div>
					</div>
				</div>
		</div>
	);
}