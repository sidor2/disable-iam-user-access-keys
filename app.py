#!/usr/bin/env python3
import os

import aws_cdk as cdk

from access_keys_rotation.access_keys_rotation_stack import AccessKeysRotationStack


app = cdk.App()
AccessKeysRotationStack(app, "AccessKeysRotationStack",
    env=cdk.Environment(
        account=os.getenv('CDK_DEFAULT_ACCOUNT'),
        region=os.getenv('CDK_DEFAULT_REGION')
    )
)

app.synth()
