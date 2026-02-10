import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"

// Definição das propriedades da classe vão estar definidas dentro dessa interface 
interface ECommerceApiStackProps extends cdk.StackProps {
    productsFetchHandler: lambdaNodeJS.NodejsFunction
    productsAdminHandler: lambdaNodeJS.NodejsFunction
}


export class ECommerceApiStack extends cdk.Stack {

    // Props deixa de ser opcional 
    constructor(scope: Construct, id: string, props: ECommerceApiStackProps){
        super(scope, id, props)

        // São como pastas que agrupam nossos arquivos de logs
        const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")

        const api = new apigateway.RestApi(this, "ECommerceApi", {
            cloudWatchRole: true,
            restApiName: "ECommerceApi",
            // Geração de logs 
            deployOptions: {
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })

        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)

        // PRODUCTS
        // o / já existe dentro de root, então adicionamos o "products"
        const productsResource = api.root.addResource("products")
        productsResource.addMethod("GET", productsFetchIntegration)

        // GET products/{id}
        const productsIdResource = productsResource.addResource("{id}")
        productsIdResource.addMethod("GET", productsFetchIntegration)



        const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)
        
        // POST /products
        productsResource.addMethod("POST", productsAdminIntegration)

        // PUT /products/{id}
        productsIdResource.addMethod("PUT", productsAdminIntegration)

        // DELETE /products/{id}
        productsIdResource.addMethod("DELETE", productsAdminIntegration)
    }
}