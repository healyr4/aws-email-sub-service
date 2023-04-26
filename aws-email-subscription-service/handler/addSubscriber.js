const AWS = require("aws-sdk")
const SUBS_TABLE = process.env.USERS_TABLE
// Getting from environment var
// AWS.config.update({region: process.env.REGION})
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid")

module.exports.addSubscriber = (event,context,callback) => {

    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();

    console.log("EVENT--->" + event);

    if(typeof data.email !=="string"){
        console.error("Email validation failed")
    }

    const dbParams = {
        TableName: SUBS_TABLE,
        Item: {
            userId: uuid.v4(),
            email: data.email,
            subscriber: true,
            createdAt: timestamp,
            updatedAt: timestamp,
        }
    };

    // Put the subscriber in the DB
    
    db.put(dbParams, (error, data) => {
        if(error){
            console.log(error);
            callback( new Error(error));
            return;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
        callback(null,response);
    });
};