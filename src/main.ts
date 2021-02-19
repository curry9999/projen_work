import { BackupPlan, BackupPlanRule, BackupResource } from '@aws-cdk/aws-backup';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

export class DynamoDBStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // Create DynamoDB Table
    const table = new Table(this, 'DynamodbTable', {
      tableName: 'picturetable',
      partitionKey: {
        name: 'no',
        type: AttributeType.NUMBER,
      },
    });

    // Create AWS Backup
    const backupplan = new BackupPlan(this, 'BackupPlan', {
      backupPlanName: 'backup-plan',
    });
    backupplan.addRule(BackupPlanRule.daily());
    backupplan.addSelection('Selection', {
      resources: [
        BackupResource.fromDynamoDbTable(table), // A DynamoDB table
      ],
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