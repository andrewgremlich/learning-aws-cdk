import { DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBDocument): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body!);

  const result = await ddbClient.send(new PutCommand({
    TableName: process.env.SPACES_TABLE_NAME,
    Item: { ...item, id: randomId }
  }))

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: randomId
    })
  }
}