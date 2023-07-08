import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as config from 'aws-cdk-lib/aws-config';


export class AccessKeysRotationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new config.ManagedRule(this, 'AccessKeysRotated', {
      identifier: config.ManagedRuleIdentifiers.ACCESS_KEYS_ROTATED,
      inputParameters: {
        maxAccessKeyAge: 60, // default is 90 days
      },
    
      // default is 24 hours
      maximumExecutionFrequency: config.MaximumExecutionFrequency.TWELVE_HOURS,
      ruleScope: config.RuleScope.fromResources([config.ResourceType.IAM_USER]),
    });


    
    
  }
}
