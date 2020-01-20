import React from 'react';

import './Annotation.css'

export default class AnnotationModal extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {
			isShowing: false,
			description: this.props.desc
		}
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleOpenModal() {
		this.setState({isShowing: true})
	}
	
	handleCloseModal() {
		this.setState({isShowing: false})
	}

	render() {
		let show = this.state.isShowing ? "annotation-modal" : "annotation-modal hidden";
		return (
			<div className={show}>
				Modal content
				{this.state.description}
				<button type="button" onClick={this.handleCloseModal}>Close</button>
			</div>
		);
	}
}