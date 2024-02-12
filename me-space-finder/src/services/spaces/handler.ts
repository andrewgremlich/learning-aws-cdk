import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(ddbClient);

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    let message: string;

    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbDocClient);
        console.log(getResponse);
        return getResponse;

      case "POST":
        const postResponse = await postSpaces(event, ddbDocClient);
        return postResponse;

      case "PUT":
        const putResponse = await updateSpace(event, ddbDocClient);
        return putResponse;

      case "DELETE":
        const deleteLocation = await deleteSpace(event, ddbDocClient);
        return deleteLocation;

      default:
        message = "Default message";
        break;
    }

    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(message),
    };

    return response;
  } catch (error: unknown) {
    const err: Error = error as Error;
    console.error(err);

    if (error instanceof MissingFieldError) {
      return {
        statusCode: 500,
        body: JSON.stringify(err.message),
      };
    }

    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify("An error occurred!"),
  };
}

export { handler };
