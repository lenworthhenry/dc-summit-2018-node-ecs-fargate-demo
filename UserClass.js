const {
    DynamoDbSchema,
    DynamoDbTable,
    embed,
} = require('@aws/dynamodb-data-mapper');
const v4 = require('uuid/v4');

class UserClass {
    // Declare methods and properties as usual
}

Object.defineProperties(UserClass.prototype, {
    [DynamoDbTable]: {
        value: 'Users'
    },
    [DynamoDbSchema]: {
        value: {
            id: {
                type: 'String',
                keyType: 'HASH',
                defaultProvider: v4,
            },
            createdAt: {
	              type: 'Date',
	              keyType: 'RANGE'
            },
            username: {type: 'String'},
            email: {type: 'String'}
        },
    },
});
module.exports = UserClass;

