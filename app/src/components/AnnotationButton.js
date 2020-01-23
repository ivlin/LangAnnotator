import React from 'react';

import './Annotation.css'

export default class AnnotationButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowing: false,
			isHighlighted: false
		}
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnClick() {
		//this.props.modal.openModal();
	}

	handleOnHover() {
		console.log("hover")
		//this.setState({ isHighlighted: true });
	}

	render() {
		return (
			<span className={ this.state.isHighlighted ? "annotation-btn hover" : "annotation-btn"} 
					onMouseOver={ this.handleOnHover }
					onClick={ this.handleOnClick }
					style={ {lineHeight: ""+(20+(this.props.depth-1))+"px",
							paddingBottom: ""+(4*(this.props.depth-1))+"px"} }>
				{ this.props.children }
			</span>
		);
	}
}