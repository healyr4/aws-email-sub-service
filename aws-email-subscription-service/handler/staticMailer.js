const AWS = require("aws-sdk")
//const SUBS_TABLE = process.env.USERS_TABLE
const sns = new AWS.SNS();
// Promise-based HTTP library that lets you consume an API service
const axios = require("axios")
const TOPIC_ARN = process.env.SNS_TOPIC_ARN
// Endpoint we post email to add the email to db
const SUBSCRIBE_ENDPOINT = "https://epxug9qvi1.execute-api.eu-west-1.amazonaws.com/dev/subscribe"

const publishToSNS = (message) => {
    sns.publish({
        Message: message,
        TopicArn: TOPIC_ARN
    }).promise();
}

const buildEmailBody = (id,form) => {
    return `
        Message: ${form.message}
        Name: ${form.name}
        Email: ${form.email}
        Service info : ${id.sourceIp} - ${id.userAgent}
    `
}

module.exports.staticMailer = async (event) => {

    console.log("Event-->" + event);
    const data = JSON.parse(event.body);
    const emailBody = buildEmailBody(event.requestContext.identity, data);

    publishToSNS(emailBody);

    await axios.post(
        SUBSCRIBE_ENDPOINT,
        {email: data.email}
    ).then(function(response){
        console.log(response);
    }).catch(function(error){
        console.log("Error when subscribing user--->" +error);
    })

    return {
        // Headers required for cors front-end
        headers: {
            "Access-Control-Allow-Credentials": false,
            "Access-Control-Allow-Origin": "*",
        },
        statusCode: 200,
        body: JSON.stringify({message: "OK!"})

    }
}