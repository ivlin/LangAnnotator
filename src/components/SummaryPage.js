import React from 'react';

import AnnotationButton from './AnnotationButton'

export default class SummaryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowing: true
		}
	}

	render() {
		let annotations = []
		for (var i=0; i < this.props.annotations.length; i++){
			let cur = this.props.annotations[i];
			annotations.push(
				<span key={ cur.id }> 
					<span style={{color: cur.color}}>{cur.selection}</span> - { cur.description } 
				</span>);
		}
		return (<div>
			{ this.state.isShowing && (<div className="modal-bg" onClick={ this.props.toggler } style={ {color: "black"} }>
			<div id="summary-modal" className="modal">
				<div className="modal-inner">
					<div className="modal-header"></div>
					<hr></hr>
					{ annotations }
				</div>
			</div>
			</div>) }
		</div>);
	}
}