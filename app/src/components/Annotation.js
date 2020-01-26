export default class Annotation {
	constructor() {
		this._groups = []
	}
	//MUTATORS
	set id(id) {
		this._id = id;
	}
	set groups(nodes) {
		this._groups = nodes;
	}
	set startIndex(start) {
		this._start = start;
	}
	set endIndex(end) {
		this._end = end;
	}
	set depth(depth) {
		this._depth = depth;
	}
	set title(title) {
		this._title = title;
	}
	set description(desc) {
		this._description = desc;
	}
	set selection(sel) {
		this._selection = sel;
	}
	set color(color) {
		this._color = color;
	}
	// ACCESSORS
	get id() {
		return this._id;
	}
	get groups() {
		return this._groups;
	}
	get startIndex() {
		return this._start;
	}
	get endIndex() {
		return this._end;
	}
	get depth() {
		return this._depth;
	}
	get title() {
		return this._title;
	}
	get description() {
		return this._description;
	}
	get selection() {
		return this._selection;
	}
	get color() {
		return this._color;
	}
}