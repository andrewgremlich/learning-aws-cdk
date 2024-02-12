import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocument, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBDocument
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const spaceId = event.queryStringParameters.id;
    const parsedBody = JSON.parse(event.body);
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];
    const updateCommand = new UpdateCommand({
      TableName: process.env.SPACES_TABLE_NAME,
      Key: {
        id: spaceId,
        continent: event.queryStringParameters.continent,
      },
      UpdateExpression: "set #replaceKey = :new",
      ExpressionAttributeValues: {
        ":new": requestBodyValue,
      },
      ExpressionAttributeNames: {
        "#replaceKey": requestBodyKey,
      },
      ReturnValues: "ALL_NEW",
    });

    const updateResult = await ddbClient.send(updateCommand);

    if (updateResult) {
      return {
        statusCode: 200,
        body: JSON.stringify(updateResult),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Space not found with this id",
        }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Please provide right arguments." }),
  };
}
