#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AccessKeysRotationStack } from '../lib/access-keys-rotation-stack';

const app = new cdk.App();
new AccessKeysRotationStack(app, 'AccessKeysRotationStack', {
  
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

});