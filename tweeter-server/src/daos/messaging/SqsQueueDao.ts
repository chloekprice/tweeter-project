import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { QueueDao } from "./QueueDao";

export class SqsQueueDao implements QueueDao {
    readonly delaySeconds = 10;
    readonly fanoutUrl = "https://sqs.us-east-1.amazonaws.com/123398428865/PostUserStatusQueue"
    readonly workerUrl = "https://sqs.us-east-1.amazonaws.com/123398428865/UpdateFeedsQueue"

    private readonly client;
    
    public constructor(client: SQSClient) {
        this.client = client;
    }

    async sendFanoutMessage(messageBody: string): Promise<void> {
        await this.sendMessage(messageBody, this.fanoutUrl);
    }

    async sendWorkerMessage(messageBody: string): Promise<void> {
        await this.sendMessage(messageBody, this.workerUrl);
    }

    private async sendMessage(message: string, url: string): Promise<void> {
        const params = {
            DelaySeconds: this.delaySeconds,
            MessageBody: message,
            QueueUrl: url,
        };

        const messageCommand = new SendMessageCommand(params);
        
        try {
            await this.client.send(messageCommand);
        } catch (error) {
            throw Error("Internal Server Error: failed to send message to queue: " + error);
        }
    }
    
}
