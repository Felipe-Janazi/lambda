#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "203918856837",
  region: 'us-east-1'
}

const tags = {
  cost: "ECommerce",
  team: "Janazi-DevOps"
}

const productsAppLayersStack = new ProductsAppLayersStack (app, "ProductsAppLayers", {
  tags: tags,
  env: env
})

const productsAppStack = new ProductsAppStack(app, 'ProductsAppStack', {
  tags: tags,
  env: env
});

//Dependencia de, não pode criar antes da LayersStack
productsAppStack.addDependency(productsAppLayersStack)

// Criação da stack de API Gateway, conexão com o fetch handler da stack de products
const eCommerceApiStack = new ECommerceApiStack(app, 'ECommerceApiStack', {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
});

eCommerceApiStack.addDependency(productsAppStack);
