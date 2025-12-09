import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  ScanCommandOutput
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

const TABLE_KEYS: Record<string, string[]> = {
  counts: ["user_alias"],
  feeds: ["user_alias", "timestamp"],
  follows: ["follower_handle", "followee_handle"],
  users: ["alias"],
  statuses: ["user_alias", "timestamp"],
  sessions: ["token"],
};

const TABLES = Object.keys(TABLE_KEYS);
const BATCH_SIZE = 25; // DynamoDB batchWrite limit

async function clearAllTables() {
  for (const tableName of TABLES) {
    console.log(`\n==============================`);
    console.log(`Deleting all items from ${tableName}`);
    console.log(`==============================`);

    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    do {
      // Scan table
      const scanResult: ScanCommandOutput = await client.send(
        new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
        })
      );

      const items = scanResult.Items ?? [];
      lastEvaluatedKey = scanResult.LastEvaluatedKey;

      if (items.length === 0) {
        console.log(`No items to delete in ${tableName}`);
        break;
      }

      // Convert items to delete requests
      const deleteRequests = items.map(item => {
        const keyAttrs = TABLE_KEYS[tableName];
        const key: Record<string, any> = {};
        for (const attr of keyAttrs) {
          key[attr] = item[attr];
        }
        return { DeleteRequest: { Key: key } };
      });

      // Split into batches of 25
      for (let i = 0; i < deleteRequests.length; i += BATCH_SIZE) {
        const batch = deleteRequests.slice(i, i + BATCH_SIZE);

        const params: BatchWriteCommandInput = {
          RequestItems: {
            [tableName]: batch,
          },
        };

        let resp: BatchWriteCommandOutput;
        try {
          resp = await client.send(new BatchWriteCommand(params));
        } catch (err) {
          console.error(`DELETE BATCH FAILED for ${tableName}:`, err);
          continue;
        }

        // Retry unprocessed items
        await retryUnprocessedItems(tableName, resp);
      }

    } while (lastEvaluatedKey);

    console.log(`Finished deleting items from ${tableName}`);
  }
}

async function retryUnprocessedItems(tableName: string, resp: BatchWriteCommandOutput) {
  let unprocessed = resp.UnprocessedItems;
  let delay = 50;
  let attempts = 0;

  while (unprocessed && Object.keys(unprocessed).length > 0) {
    attempts++;
    console.log(`Retrying ${Object.keys(unprocessed).length} unprocessed items for ${tableName}, attempt ${attempts}`);

    await new Promise(resolve => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, 1000); // exponential backoff

    const params: BatchWriteCommandInput = { RequestItems: unprocessed };
    try {
      const retryResp = await client.send(new BatchWriteCommand(params));
      unprocessed = retryResp.UnprocessedItems;
    } catch (err) {
      console.error(`Error retrying unprocessed items for ${tableName}:`, err);
      break;
    }
  }
}

// Run the script
clearAllTables()
  .then(() => console.log("\nAll tables cleared successfully!"))
  .catch(err => console.error("\nError clearing tables:", err));
