import React from 'react';

import './Annotation.css'

const colors = [
	"#e88", //red
	"#ec5", //orange
	"#7a5", //green
	"#48f", //blue
	"#99e", //violet
	"#e9d" //pink
]

export default class AnnotationButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowing: false,
			isHighlighted: false,
			color: this.props.color
		}
		this.handleOnShow = this.handleOnShow.bind(this);
		this.handleOnClose = this.handleOnClose.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.handleHover = this.handleHover.bind(this);
	}

	handleHover() {
		//console.log(this.props.annotation.id)
		//console.log(this.props.annotation.color);
	}

	handleColorChange(c) {
		this.setState({color: c});
		this.props.annotation.color = c;
		this.props.updater(this.props.annotation, c);
	}

	handleOnShow() {
		if (!this.state.isShowing){
			this.setState({ isShowing: true });
		}
	}

	handleOnClose(e) {
		if (document.getElementsByClassName("modal").length && 
			!document.getElementsByClassName("modal")[0].contains(e.target)){
			this.setState({ isShowing: false });
		}
		e.stopPropagation();
	}

	render() {
		//console.log("btn rerender")
		let color_buttons = colors.map((c) => <span onClick={ () => this.handleColorChange(c) } 
													className="color-selector" 
													key={c} 
													style={{backgroundColor: c}}></span>)
		return (
			<span>
				<span className={ this.state.isHighlighted ? "annotation-btn" : "annotation-btn"} 
					onMouseOver={ this.handleHover }
					onClick={ this.handleOnShow }
					style={ {background: `linear-gradient(0deg, ${this.props.annotation.color}, white 1px, transparent 1px)`,
							lineHeight: ""+(20+(this.props.depth-1))+"px",
							paddingBottom: ""+(4*(this.props.depth-1))+"px",
							color: this.props.annotation.color} }>
				{ this.props.children }
				</span>
				{ 
					this.state.isShowing && 
					<div className="modal-bg" onClick={ this.handleOnClose } style={ {color: "black"} }>
						<div className="modal">
							<div className="modal-header">
								{ color_buttons }
							</div>
							<hr></hr>
							{ this.props.annotation.description }
						</div>
					</div>
				}
			</span>
		);
	}
}