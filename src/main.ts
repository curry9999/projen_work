import { BackupPlan, BackupPlanRule, BackupResource } from '@aws-cdk/aws-backup';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

// DynamoDB Stack
export class DynamoDBStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // Lambda Service Role
    const servicerole = new Role(this, 'IamRoleLambda', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
      ],
    });

    // Create DynamoDB Table
    const table = new Table(this, 'DynamodbTable', {
      partitionKey: {
        name: 'no',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'col',
        type: AttributeType.STRING,
      },
    });

    // Create AWS Backup
    const backupplan = new BackupPlan(this, 'BackupPlan', {});
    backupplan.addRule(BackupPlanRule.daily());
    backupplan.addSelection('Selection', {
      resources: [
        BackupResource.fromDynamoDbTable(table), // A DynamoDB table
      ],
    });

    // Lambda
    new Function(this, 'LabmdaFunction', {
      handler: 'index.handler',
      code: Code.fromAsset('functions'),
      runtime: Runtime.NODEJS_14_X,
      environment: {
        tablename: table.tableName,
      },
      role: servicerole,
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