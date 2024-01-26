import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(ddbClient);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbDocClient);
        console.log(getResponse)
        return getResponse;

      case 'POST':
        const postResponse = await postSpaces(event, ddbDocClient);
        return postResponse;

      case 'PUT':
        const putResponse = await updateSpace(event, ddbDocClient);
        return putResponse;

      default:
        message = 'Default message';
        break;
    }
  } catch (error: unknown) {
    const err: Error = error as Error;
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message)
  };

  return response;
}

export { handler }