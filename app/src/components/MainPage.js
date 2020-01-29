import React from 'react';
import Sidebar from 'react-sidebar';
import { FaBars } from 'react-icons/fa'

import MainText from './MainText';

export default class MainPage extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			isExample: false,
			sidebarOpen: false
		};
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		this.handleExample = this.handleExample.bind(this);
	}

	onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open })
	}

	handleExample() {

	}

	render() {
		var sidebarContent = 
			<div className="sideNav">
				<a className="menuItem" href="#" onClick={ this.handleExample }> Example </a>
				<a className="menuItem" href="#" onClick={ this.handleExample }> Load Text </a>
				<a className="menuItem" href="#" onClick={ this.handleExample }> Help </a>
			</div>
	    return (
	    	<div>
	    		<Sidebar sidebar={ sidebarContent }
			        	open={this.state.sidebarOpen}
			        	onSetOpen={this.onSetSidebarOpen}
			        	styles={{ sidebar: { background: "white", width: "10em"} }}>
     				
     				<div class="menuBar">	
	     				<button style={{ minHeight: "2em" }} onClick={() => this.onSetSidebarOpen(true)}>
    	     				<FaBars/>
        				</button>
        				<span>
        					LangAnnotator
        				</span>
		    		</div>

		    		<MainText></MainText>

	    		</Sidebar>
	    	</div>);
	}
}