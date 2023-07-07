import aws_cdk as core
import aws_cdk.assertions as assertions

from access_keys_rotation.access_keys_rotation_stack import AccessKeysRotationStack

# example tests. To run these tests, uncomment this file along with the example
# resource in access_keys_rotation/access_keys_rotation_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = AccessKeysRotationStack(app, "access-keys-rotation")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
