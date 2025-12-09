import { User } from "tweeter-shared";
import { FillUserTableDao } from "./FillUserTableDao";
import { FillFollowTableDao } from "./FillFollowTableDao";
import { FillCountsTableDao } from "./FillCountTableDao";
import { Count } from "../entities/Count";

// Increase the write capacities for the follow table, follow index, and user table, 
// AND REMEMBER TO DECREASE THEM after running this script

const mainUsername = "@daisy";
const baseFollowerAlias = "@donald";
const followerPassword = "password";
const followerImageUrl =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";

const baseFollowerFirstName = "Donald";
const baseFollowerLastName = "Duck";

const numbUsersToCreate = 10000;
const numbFollowsToCreate = numbUsersToCreate;
const batchSize = 25;

const fillUserTableDao = new FillUserTableDao();
const fillFollowTableDao = new FillFollowTableDao();
const fillCountsTableDao = new FillCountsTableDao();

// Stores follower User objects
const followerUsers: User[] = [];

// Daisy (the followee)
const followeeUser = new User(
  "Daisy",
  "Duck",
  mainUsername,
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
);

main();

async function main() {
  console.log("Creating Daisy user");
  await fillUserTableDao.createUsers([followeeUser], followerPassword);

  console.log("Creating follower users");
  await createUsers(0);

  console.log("Creating follows");
  await createFollows(0);

  console.log("Creating counts");
  await createCounts();

  console.log("Done!");
}

/**
 * Create COUNT records for Daisy and all followers
 */
async function createCounts() {
  const countsList = [];

  // 1. Daisy gets 10,000 followers and followeeCount = 1
  countsList.push({
    userAlias: followeeUser.alias,
    followerCount: numbUsersToCreate,
    followeeCount: 1,
  });

  // 2. Each follower gets followerCount = 0, followeeCount = 1
  for (const follower of followerUsers) {
    countsList.push({
      userAlias: follower.alias,
      followerCount: 0,
      followeeCount: 1,
    });
  }

  // Convert raw values into Count entities
  const countEntities = countsList.map(
    (c) => new Count(c.userAlias, c.followeeCount, c.followerCount)
  );

  console.log(`Creating ${countEntities.length} count rows...`);

  await fillCountsTableDao.createCounts(countEntities);
}

/**
 * Create follower users
 */
async function createUsers(createdUserCount: number) {
  const userList = createUserList(createdUserCount);

  followerUsers.push(...userList);

  await fillUserTableDao.createUsers(userList, followerPassword);

  createdUserCount += batchSize;

  if (createdUserCount % 1000 == 0) {
    console.log(`Created ${createdUserCount} users`);
  }

  if (createdUserCount < numbUsersToCreate) {
    await createUsers(createdUserCount);
  }
}

/**
 * Makes the next batch of follower User objects
 */
function createUserList(createdUserCount: number) {
  const users: User[] = [];

  const start = createdUserCount + 1;
  const limit = start + batchSize;

  for (let i = start; i < limit; ++i) {
    let user = new User(
      `${baseFollowerFirstName}_${i}`,
      `${baseFollowerLastName}_${i}`,
      `${baseFollowerAlias}${i}`,
      followerImageUrl
    );

    users.push(user);
  }

  return users;
}

/**
 * Create the follow relationships:
 * Donald_x  → Daisy
 */
async function createFollows(createdFollowsCount: number) {
  const followerBatch = followerUsers.slice(
    createdFollowsCount,
    createdFollowsCount + batchSize
  );

  await fillFollowTableDao.createFollows(followeeUser, followerBatch);

  createdFollowsCount += batchSize;

  if (createdFollowsCount % 1000 == 0) {
    console.log(`Created ${createdFollowsCount} follows`);
  }

  if (createdFollowsCount < numbFollowsToCreate) {
    await createFollows(createdFollowsCount);
  }
}

