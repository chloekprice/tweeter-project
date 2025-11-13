import { StatusDto } from "tweeter-shared";

class PostService {

    public async postStatus(token: string, userAlias: string, newStatus: StatusDto): Promise<void> {
        // Pause so we can see the logging out message. Remove when backend fleshed out
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Actually post the status
    };
}

export default PostService;
