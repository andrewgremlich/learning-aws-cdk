export const handler = async () => {
  try {
    // Your code here
    return {
      statusCode: 200,
      body: "Hello, world!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
