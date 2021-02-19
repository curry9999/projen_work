import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

export class DynamoDBStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new Table(this, 'PostTable', {
      partitionKey: {
        name: 'no',
        type: AttributeType.NUMBER,
      },
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new DynamoDBStack(app, 'dynamodb-dev', { env: devEnv });

app.synth();