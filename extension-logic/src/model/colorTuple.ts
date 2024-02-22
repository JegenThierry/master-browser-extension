export default class ColorTuple {
    public color: string = '';
    public borderColor: string | undefined = undefined;

    constructor(color:string, borderColor:string) {
        this.color = color;
        this.borderColor = borderColor;
    }
}