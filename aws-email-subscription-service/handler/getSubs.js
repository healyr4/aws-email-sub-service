const AWS = require("aws-sdk");
const USERS_TABLE = process.env.USERS_TABLE;
const db = new AWS.DynamoDB.DocumentClient();

module.exports.getSubs = (event, context, callback) => {
    console.log("Getting Subs");
    const dbParams = {
        TableName: USERS_TABLE
    }

    db.scan(dbParams, (error, data) => {
        if (error) {
            console.error(error);
            callback(new Error(error));
            return;
          }
      
          const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items),
          };
      
          callback(null, response);
    });
};



