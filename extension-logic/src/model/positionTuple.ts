export default class PositionTuple {
	public x: number = 0;
	public y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public getPositionStyleX() {
		return `${this.x}px`;
	}

	public getPositionStyleY() {
		return `${this.y}px`;
	}
}
