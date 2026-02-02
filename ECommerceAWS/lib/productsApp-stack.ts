import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

// CRIAÇÃO DO API GATEWAY 

export class ProductsAppStack extends cdk.Stack {

    // Atributo de classe que representa a função de fetch de produtos
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction;
    // Scope: Onde a stack está inserida
    // Id: Identificador da stack
    // Props: Propriedades da stack
    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props)

            this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsFetchFunction", {
                // Nome que irá exibir no console da AWS
                functionName: "ProductsFetchFunction",
                // Caminho do arquivo que contém a função
                entry: "lambda/products/productsFetchFunction.ts",
                // Função que será executada
                handler: "handler",
                // Quantidade de memória que a função terá
                memorySize: 128,
                // Tempo máximo que a função pode executar
                timeout: cdk.Duration.seconds(5),
                // Como a função será empacotada no arquivo 
                bundling: {
                    // Transformando o código em o menor possível
                    minify: true,
                    // Retirando a criação de mapas para fazer debug
                    sourceMap: false
                },
        });
    }
}
