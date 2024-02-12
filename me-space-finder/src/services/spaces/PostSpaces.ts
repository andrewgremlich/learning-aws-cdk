import { DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/Validator";
import { parseJson } from "../shared/Utils";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBDocument
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = parseJson(event.body!);
  item.id = randomId;

  validateAsSpaceEntry(item);

  const result = await ddbClient.send(
    new PutCommand({
      TableName: process.env.SPACES_TABLE_NAME,
      Item: { ...item },
    })
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: randomId,
    }),
  };
}
