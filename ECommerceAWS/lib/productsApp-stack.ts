import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { DynamoDBBatchItemFailure } from "aws-lambda"
import { CfnDirectoryBucket } from "aws-cdk-lib/aws-s3express"
import * as ssm from "aws-cdk-lib/aws-ssm"
// CRIAÇÃO DO API GATEWAY 

export class ProductsAppStack extends cdk.Stack {

    // Atributo de classe que representa a função de fetch de produtos
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction;
    readonly productsAdminHandler: lambdaNodeJS.NodejsFunction;
    readonly productsDdb: dynamodb.Table;

    // Scope: Onde a stack está inserida
    // Id: Identificador da stack
    // Props: Propriedades da stack
    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props)

        // Criação da tabela de produtos
        this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
            tableName: "products",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1,
        });

        //Products Layer
        const productsLayerArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayerVersionArn") 
        const productsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayerVersionArn", productsLayerArn)

        // Criação da função de fetch de produtos
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
            environment: {
                PRODUCTS_DDB: this.productsDdb.tableName,
            },
            layers: [productsLayer]
        });

        // Permissão para a função ler dados da tabela de produtos
        this.productsDdb.grantReadData(this.productsFetchHandler);

        this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsAdminFunction", {
            // Nome que irá exibir no console da AWS
            functionName: "ProductsAdminFunction",
            // Caminho do arquivo que contém a função
            entry: "lambda/products/productsAdminFunction.ts",
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
            environment: {
                PRODUCTS_DDB: this.productsDdb.tableName,
            },
            layers: [productsLayer]
        });

        // Permissão para admin handler poder escrever na tabela
        this.productsDdb.grantWriteData(this.productsAdminHandler);
    }
}
