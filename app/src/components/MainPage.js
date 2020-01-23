import React from 'react';
import ReactDOM from 'react-dom';

import MainText from './MainText'

export default class MainPage extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.handleModifyText = this.handleModifyText.bind(this);
		this.state = {
			test: "01234 67890123 56 890 2345678 0123 5678 01 3456 8901 345 789012ss" 
		}
	}

	handleModifyText() {
		this.setState({test:"asbfgbdsbsd fdsg"})
	}

	render() {
	    return (
	    	<div>
	    	<MainText text={this.state.test}></MainText>
	    	<button type="button" onClick={this.handleModifyText}>Modify</button>
	    	</div>)
	}
}