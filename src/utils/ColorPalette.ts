enum Colors {
	Red = "#e88", //red
	Orange = "#ec5", //orange
	Green = "#7a5", //green
	Blue = "#48f", //blue
	Violet = "#99e", //violet
	Pink = "#e9d" //pink
}

export class ColorPalette {

	constructor() {
	}

	getPalette(numColors: number) {
		 return Object.values(Colors).filter((v) => !isNaN(Number(v)));
	}
}