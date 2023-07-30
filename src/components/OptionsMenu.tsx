import { FunctionComponent, useState } from 'react';
import { useKeyPress } from './ShortcutHandler';

type OptionsMenuProps = {
	editMode: boolean, 
	toggleHighlightModeCallback: ()=>void, 
	toggleEditModeCallback: ()=>void, 
	toggleConfigVisibility: ()=>void, 
	toggleHelpVisibility: ()=>void 
}

export const OptionsMenu: FunctionComponent<OptionsMenuProps> = (props: OptionsMenuProps) => {
	const { editMode, toggleHighlightModeCallback, toggleEditModeCallback, toggleConfigVisibility, toggleHelpVisibility } = props;
	const [expand, setExpand] = useState(true);

	useKeyPress(["Ctrl","P"], toggleHelpVisibility);
	useKeyPress(["Ctrl","I"], toggleConfigVisibility);
	useKeyPress(["Ctrl","H"], toggleHighlightModeCallback);
	useKeyPress(["Ctrl","E"], toggleEditModeCallback);

	return (
	    <div className="modeDescriptor">
	      <div className="modeSection">
	        <button className={editMode ? "menuOptionButton" : "menuOptionButton modeActive"} onClick={toggleHighlightModeCallback}>
	          <i className="fa fa-magic fa-lg"></i>
	        </button>
	        <div className="buttonLabel">
	          <u>H</u>ighlight
	        </div>
	      </div>
	      <div className="modeSection">
	        <button className={editMode ? "menuOptionButton modeActive" : "menuOptionButton"} onClick={toggleEditModeCallback}>
	          <i className="fa fa-edit fa-lg"></i>
	        </button>
	        <div className="buttonLabel">
	          <u>E</u>dit
	        </div>
	      </div>
	      
	      	{ expand ?
		      	<>
			      <div className="modeSection">
			        <button className="menuOptionButton" onClick={toggleConfigVisibility}>
			          <i className="fa fa-cog fa-lg"></i>
			        </button>
			        <div className="buttonLabel">
			          <u>I</u>mport/Export
			        </div>
			      </div>
			      <div className="modeSection">
			        <button className="menuOptionButton" onClick={toggleHelpVisibility}>
			          <i className="fa fa-question fa-lg"></i>
			        </button>
			        <div className="buttonLabel">
			          Hel<u>p</u>
			        </div>
			      </div> 
		      	</> :
		      	<>
		      		<div>
		      		</div>
		      	</>  
	  		}
	    </div>
	);
}