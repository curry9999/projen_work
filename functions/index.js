var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
});

exports.handler = (event, context, callback) => {
    var tbl=process.env.tablename
    dynamo.put({
        "TableName": tbl,
        "Item": {
            "no": "no12",
            "col": "col23",
        }
    }, function( err, data ) {
        console.log("dynamo_err:", err);
        context.done(null, data);
    });
};
