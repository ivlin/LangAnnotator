import { FunctionComponent } from 'react';

type HelpModalProps = {
	hideHelpHandler: () => void
}

export const HelpModal: FunctionComponent<HelpModalProps> = (props: HelpModalProps) => {
	const { hideHelpHandler } = props;
	return (<div style={{
				display: "block", position: "fixed", 
				zIndex: 1, left: 0, top: 0, 
				width: "100%", height: "100%", overflow: "auto", paddingTop: "250px", 
				backgroundColor: "rgba(0,0,0,0.4)"
			}}>
			<div style={{
				backgroundColor: "#DDD", margin: "auto",
				padding: "15px", width: "80%", color: "black"
			}}>
				<div>
					<span onClick={hideHelpHandler} style={{
						color: "black", textDecoration: "none", cursor: "pointer", float: "right"
					}}>
						<i className="fa fa-close"></i>
					</span>
				</div>
				<div>
					Help
					<hr />
					<div className="helpTable" style={{ display: "flex", flexDirection: "column"}}>
						<div className="helpTableRow">
							<button className="button"><i className="fa fa-magic fa-2x"></i></button>
							Turns on highlight mode. 
						</div>
						<div className="helpTableRow">
							<button className="button"><i className="fa fa-edit fa-2x"></i></button>
							Turns on edit mode.
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