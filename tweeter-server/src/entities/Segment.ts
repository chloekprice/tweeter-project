
export class Segment {
    text: string;
    startPosition: number;
    endPosition: number;
    type: string;

    public constructor(
        text: string,
        startPosition: number,
        endPosition: number,
        type: string
    ) {
        this.text = text;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.type = type;
    }
}
