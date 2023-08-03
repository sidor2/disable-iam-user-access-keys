import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as config from 'aws-cdk-lib/aws-config';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';


export class AccessKeysRotationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const managedRule = new config.ManagedRule(this, 'AccessKeysRotated', {
      identifier: config.ManagedRuleIdentifiers.ACCESS_KEYS_ROTATED,
      inputParameters: {
        maxAccessKeyAge: 60, // default is 90 days
      },
      
      // default is 24 hours
      maximumExecutionFrequency: config.MaximumExecutionFrequency.TWENTY_FOUR_HOURS,
      ruleScope: config.RuleScope.fromResources([config.ResourceType.IAM_USER]),
    });
    
    // IAM role for SSM automation
    const ssmAutomationRole = new iam.Role(this, 'SsmAutomationRole', {
      assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
    });

    // Inline policy for SSM automation
    const ssmAutomationPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'iam:*',
        'config:ListDiscoveredResources'
      ],
      resources: ['*'], // Add specific resource ARNs if necessary
    });

    // Add the policy to the SSM automation role
    ssmAutomationRole.addToPolicy(ssmAutomationPolicy);

    const parameters = {
      'AutomationAssumeRole': {
        "StaticValue": {
          "Values": [`${ssmAutomationRole.roleArn}`]
        }
      },
      'IAMResourceId': {
        "ResourceValue": {
          "Value": "RESOURCE_ID"
        }
      },
      'MaxCredentialUsageAge': {
        "StaticValue": {
          "Values": [90]
        }
      }
    };

    const cfnRemediationConfiguration = new config.CfnRemediationConfiguration(this, 'MyCfnRemediationConfiguration', {
      configRuleName: managedRule.configRuleName,
      targetId: 'AWSConfigRemediation-RevokeUnusedIAMUserCredentials',
      targetType: 'SSM_DOCUMENT',
      automatic: true,
      maximumAutomaticAttempts: 2,
      parameters: parameters,
      retryAttemptSeconds: 300,
    });

  }
}
