import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBDocument): Promise<APIGatewayProxyResult> {

  if (event.queryStringParameters) {
    if (['continent', 'forward', 'limit'].every((key) => Object.keys(event.queryStringParameters ?? {}).includes(key))) {
      const continent = event.queryStringParameters.continent;
      const result = await ddbClient.query({
        TableName: process.env.SPACES_TABLE_NAME,
        IndexName: 'continent-index',
        KeyConditionExpression: 'continent = :continent',
        ExpressionAttributeValues: {
          ':continent': continent
        },
        ScanIndexForward: event.queryStringParameters?.forward === 'true' ? true : false,
        Limit: event.queryStringParameters?.limit ? parseInt(event.queryStringParameters?.limit) : undefined,
        ExclusiveStartKey: event.queryStringParameters?.lastKey ? {
          id: event.queryStringParameters?.lastKey,
          continent: continent
        } : undefined
      })
      const itemsCount = await ddbClient.query({
        TableName: process.env.SPACES_TABLE_NAME,
        IndexName: 'continent-index',
        KeyConditionExpression: 'continent = :continent',
        ExpressionAttributeValues: {
          ':continent': continent
        },
        Select: 'COUNT'
      })

      if (result.Items && result.Items.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({...result, count: itemsCount.Count})
        }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Spaces not found with this continent'
          })
        }
      }
    }

    if ('id' in event.queryStringParameters) {
      const spaceId = event.queryStringParameters.id;
      const getItemResponse = await ddbClient.query({
        TableName: process.env.SPACES_TABLE_NAME,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': spaceId
        },
        ScanIndexForward: false
      })

      if (getItemResponse) {
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResponse)
        }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Space not found'
          })
        }
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Please provide right arguments. Keys provided are ${Object.keys(event.queryStringParameters)}`
      })
    }
  }

  const result = await ddbClient.send(new ScanCommand({
    TableName: process.env.SPACES_TABLE_NAME,
  }))

  const marshalledItems = result.Items?.map(item => unmarshall(item));

  return {
    statusCode: 200,
    body: JSON.stringify(marshalledItems)
  }
}