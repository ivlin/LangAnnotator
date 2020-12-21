import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa'

import './Annotation.css'
import './TextBody.css'

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
			color: this.props.color,
			isEditing: false
		}
		this.handleDeleter = this.handleDeleter.bind(this);
		this.handleOnShow = this.handleOnShow.bind(this);
		this.handleOnClose = this.handleOnClose.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.handleHover = this.handleHover.bind(this);
		this.handleEditMode = this.handleEditMode.bind(this);
		this.handleViewMode = this.handleViewMode.bind(this);
		this.handleViewModeReset = this.handleViewModeReset.bind(this);
	}

	handleHover() {
	}

	handleDeleter() {
		this.props.deleter(this)
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

	handleEditMode() {
		this.setState({ isEditing : !this.state.isEditing });
	}

	handleViewMode() {
		this.props.annotation.description = document.getElementById("updatedDescription").value;
		this.setState({ isEditing : !this.state.isEditing });
	}

	handleViewModeReset() {
		document.getElementById("updatedDescription").value = this.props.annotation.description;
		this.setState({ isEditing : !this.state.isEditing });
	}

	render() {
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
							lineHeight: `${20+(this.props.depth-1)}px`,
							paddingBottom: `${4*(this.props.depth-1)}px`,
							color: this.props.annotation.color} }>
				{ this.props.children }
				</span>
				{ 
					this.state.isShowing && 
					<div className="modal-bg" onClick={ this.handleOnClose } style={ {color: "black"} }>
						<div className="modal">
						<div className="modal-inner">
							<div className="modal-header">
								{ color_buttons }
							</div>
							<hr></hr>
							{
								!this.state.isEditing &&
								<div className="modal-desc">
									<span className="modal-desc-text">
										{ this.props.annotation.description }
									</span>
									<br></br>
									<div className="optionsBar">
									<span className="lowOptions" onClick={ this.handleEditMode } size={5}>
										<FaPen/>
									</span>
									<span className="lowOptions" onClick={ this.handleDeleter } size={5}>
										<FaTrash/>
									</span>
									</div>	
								</div>
							}
							{
								this.state.isEditing &&
								<div className="modal-desc">
									<textarea id="updatedDescription" defaultValue={ this.props.annotation.description }></textarea>
									<div>
									<button class="modal-submit" type="button" onClick={ this.handleViewMode }>Update Description</button>
									<button class="modal-reset" type="button" onClick={ this.handleViewModeReset }>Cancel</button>
									</div>
								</div>
							}
						</div>
						</div>
					</div>
				}
			</span>
		);
	}
}