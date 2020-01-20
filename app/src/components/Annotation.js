import React from 'react';

import './Annotation.css'

export default class Annotation extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isShowing: false	
		}
	}

	handleOpenModal() {
		this.setState({isShowing: true})
	}
	
	handleCloseModal() {
		this.setState({isShowing: false})
	}

	render() {
		return (
			<span></span>
		);
	}
}