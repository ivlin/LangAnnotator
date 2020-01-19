class Annotation {
	constructor() {
		this._groups = []
	}
	add(node) {
		this._groups.push(node);
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
}