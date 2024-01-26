import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = 'us-west-1';
process.env.SPACES_TABLE_NAME = 'SpacesTable-068b86451c5f';

handler({
  httpMethod: 'GET',
  queryStringParameters: {
    id: '355c97ad-1c0e-486b-9454-d20fba34c3da'
  }
  // body: JSON.stringify({ location: 'Dublin' })
} as any, {} as any)