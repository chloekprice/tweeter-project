
export interface QueueDao {
    sendFanoutMessage(messageBody: string): Promise<void>
    sendWorkerMessage(messageBody: string): Promise<void>
}
