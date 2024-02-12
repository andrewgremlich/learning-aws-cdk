import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBDocument
): Promise<APIGatewayProxyResult> {
  const spaceId = event.queryStringParameters?.id;
  const continent = event.queryStringParameters?.continent;

  if (spaceId && continent) {
    const deleteResult = await ddbClient.delete({
      TableName: process.env.SPACES_TABLE_NAME,
      Key: {
        id: spaceId,
        continent: continent,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...deleteResult, ...{ spaceId, continent } }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Please provide arguments!" }),
  };
}
