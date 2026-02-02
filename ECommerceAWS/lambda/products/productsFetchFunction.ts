import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"

// Função assíncrona, nome handler (sendo igual ao definido na stack), 
// parâmetros que o API Gateway irá passar para a função ao ser chamado 
// E ela retorna um APIGateway para o APIGateway que a chamou
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    // Irá aparecer no cloudwatch
    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId
    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)


    const method = event.httpMethod;

    if (event.resource === "/products") {
        if (method === "GET") {
            console.log("GET /products");

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "GET Products - OK"
                })
            }
        }
    }


    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad request"
        })
    }
    }
   