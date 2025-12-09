import { AmazonDatabaseFactory } from "../../daos/AmazonDatabaseFactory";
import PostService from "../../services/PostService";

const databaseProvider: AmazonDatabaseFactory = new AmazonDatabaseFactory();
const postService = new PostService(databaseProvider);

export const handler = async function (event: any) {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        await postService.sendPostToFollowers(body);
    }
    return null;
};
