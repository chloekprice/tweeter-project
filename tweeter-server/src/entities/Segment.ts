
export class Segment {
    text: string;
    startPostion: number;
    endPosition: number;
    type: string;

    public constructor(
        text: string,
        startPosition: number,
        endPosition: number,
        type: string
    ) {
        this.text = text;
        this.startPostion = startPosition;
        this.endPosition = endPosition;
        this.type = type;
    }
}
