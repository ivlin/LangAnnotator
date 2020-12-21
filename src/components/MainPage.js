import React from 'react';

import MainText from './MainText';

export default class MainPage extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			isExample: true,
			sidebarOpen: false
		};
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		this.handleExample = this.handleExample.bind(this);
	}

	onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open })
	}

	handleExample() {
		this.setState({ isExample: true });
	}

	render() {
		return <MainText></MainText>;
		/*
	    return (
	    	<div>
	    		<Sidebar sidebar={ sidebarContent }
			        	open={this.state.sidebarOpen}
			        	onSetOpen={this.onSetSidebarOpen}
			        	styles={{ sidebar: { background: "white", width: "10em"} }}>
     				
     				<div className="menuBar">	
	     				<button style={{ minHeight: "2em" }} onClick={() => this.onSetSidebarOpen(true)}>
    	     				<FaBars/>
        				</button>
        				<span>
        					LangAnnotator
        				</span>
		    		</div>

		    		<MainText runExample={ this.state.isExample }></MainText>

	    		</Sidebar>
	    	</div>);
	    */
	}
}