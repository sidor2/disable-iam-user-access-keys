# AWS CDK AccessKeysRotationStack

This AWS CDK stack sets up a Config Rule to enforce the rotation of IAM access keys for IAM users within your AWS account. It also configures an AWS Systems Manager (SSM) Automation document to revoke IAM user credentials that have not been used for a specified period.

## Prerequisites

Before deploying this stack, you need the following prerequisites:

1. AWS CLI installed and configured with appropriate credentials.
2. Node.js installed, as the AWS CDK is built on Node.js.

## Description
<!-- add the diagram image here and make it smaller-->
<img src="./diagram.png" alt="CDK App Architecture Diagram" width="25%" height="25%">

### Config Rule
The stack creates an AWS Config managed rule to check whether IAM access keys have been rotated within a certain timeframe. By default, the rule checks if access keys have been rotated within the last 60 days. You can modify the maxAccessKeyAge value in the AccessKeysRotationStack constructor to set a different rotation interval.

### SSM Automation
To automate the process of revoking IAM user credentials that have not been used for a specified period, the stack sets up an SSM Automation document. This document will be triggered by the AWS Config Rule violation, and it will revoke the unused IAM user credentials. The SSM Automation requires permissions to perform IAM actions and list discovered resources in AWS Config.

The stack creates an IAM role named SsmAutomationRole, which allows the ssm.amazonaws.com service principal to assume it. An inline policy is attached to this role to grant permissions for IAM actions and config:ListDiscoveredResources. If you need to apply more specific permissions, you can modify the ssmAutomationPolicy in the AccessKeysRotationStack constructor.

The SSM Automation configuration is defined by the CfnRemediationConfiguration resource, named MyCfnRemediationConfiguration. It specifies the AWS Config Rule (managedRule.configRuleName) that triggers the remediation and the target type (SSM_DOCUMENT). The parameters object provides the necessary parameters for the Automation execution, including the IAM user ARN and the maximum age of credentials.

## Deployment Steps
Follow these steps to deploy the stack:

1. Clone the repository and navigate to the project directory.
2. Install dependencies: 
```bash
npm install
```

3. Deploy the stack:
```bash
cdk deploy
```

7. You can test the revocation of an IAM user's access keys by running the following AWS CLI command:
```bash
aws iam update-access-key --access-key-id <Access key ID> --status Inactive --user-name <IAM user name>
```

## Clean Up
To remove the stack and its resources from your AWS account, use the following command: 
```bash
cdk destroy
```

## Additional Information

- AWS CDK documentation: https://docs.aws.amazon.com/cdk/latest/guide/home.html
- AWS Config documentation: https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html
- AWS Systems Manager (SSM) Automation documentation: https://docs.aws.amazon.com/systems-manager/latest/userguide/automation.html