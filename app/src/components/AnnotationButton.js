import React from 'react';

import './Annotation.css'

export default class AnnotationButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.children);
		return (
			{this.props.children}
		);
	}
}