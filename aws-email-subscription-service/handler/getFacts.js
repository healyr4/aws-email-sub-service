const AWS = require("aws-sdk")
// Getting from environment var
AWS.config.update({region: process.env.REGION})
// const db = AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3()

module.exports.getFacts = (event,context,callback) =>{
    console.log("EVENT----> " + event);

    const s3Params = {
        Bucket: "factsjsonbucket",
        Key: "facts.json"
    };

    // Need json from s3 bucket
    s3.getObject(s3Params, function(err,data){
        if(err){
            console.error(err);
            callback(new Error(err));
            return;
        }else {
            var factJson = JSON.parse(data.Body);
            console.log("FACT JSON --->", + factJson);

            const response = {
                // Headers required for cors front-end
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                  },
                statusCode: 200,
                body: JSON.stringify(factJson)
            };
            callback(null, response);
        }
    }
    )
}