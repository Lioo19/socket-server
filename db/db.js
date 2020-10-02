/*
* Functions to save data from chat and fetch all data from db
*/
"use strict";

const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//connect to dsn
const dsn = process.env.DBWEBB_DSN || "mongodb://localhost:27017/chat";

const projection = {
    name: 1,
    msg: 1,
    time: 1,
    _id: 0
};

/**
 * Find all documents in a collection
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} collectionName    Name of collection.
 * @param {number} limit      Limit the number of documents to retrieve.
 * @param {object} projection What to project in results.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findAll (dsn, collectionName, projection, limit=1000) {
    const client = await mongoClient.connect(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = await client.db();
    const coll = await db.collection(collectionName);
    const res = await coll.find().limit(limit).toArray();
    // console.log(res);

    await client.close();

    return res;
};

async function addToCollection(dsn, collectionName, thingToInsert) {
    const client = await mongoClient.connect(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = await client.db();
    const coll = await db.collection(collectionName);
    const res = await coll.insertOne(thingToInsert);

    await client.close();
};


//Test was successful!
// const pizzaDocument = {
//   name: "Neapolitan pizza",
//   msg: "round",
//   time: "14.30"
// };
//
// addToCollection(dsn, "log", pizzaDocument);
// findAll(dsn, "log", projection);

export { findAll, addToCollection };
