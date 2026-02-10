import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as lambda from "aws-cdk-lib/aws-lambda"

// Lugar para guardar parâmetros dentro da AWS
import * as ssm from "aws-cdk-lib/aws-ssm"
import { ConsoleConstructor } from "console"


export class ProductsAppLayersStack extends cdk.Stack {
    readonly productsLayers: lambda.LayerVersion

    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props)

        // Infraestrutura do Layer
        this.productsLayers = new lambda.LayerVersion(this, "ProductsLayers", {
            code: lambda.Code.fromAsset('lambda/products/layers/productsLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName: "ProductsLayer",
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        // Guardando um parâmetro que vai ser guardado para apontar para um layer
        new ssm.StringParameter( this, "ProductsLayerVersionArn", {
            parameterName: "ProductsLayerVersionArn",
            stringValue: this.productsLayers.layerVersionArn
        })
    }

}