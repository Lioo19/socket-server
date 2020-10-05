/**
 * Connect to the database and setup it with some default data.
 * DB: chat, COLLECTION: log
 * Reset works!
 */

const mongoClient = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/chat";

const fs = require("fs");
const path = require("path");


//use function to create collection "log"
cleanUp(dsn, "log")
    .catch(err => console.log(err));

/**
* Resetting and recreating a db. Not adding any new input.
*
* @async
*
* @param {string} dsn     DSN to connect to database.
* @param {string} colName Name of collection.
*
* @throws error if db operation fails. Don't forget the catch!
*
* @return {Promise<void>} Void
*/
async function cleanUp(dsn, colName) {
    const client = await mongoClient.connect(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = await client.db();
    const col = await db.collection(colName);

    await col.deleteMany();
    //Don't want to insert any data from start
    // await col.insertMany(doc);

    await client.close();
}
