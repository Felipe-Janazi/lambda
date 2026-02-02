#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "203918856837",
  region: 'us-east-1'
}

const tags = {
  cost: "ECommerce",
  team: "Janazi-DevOps"
}

const productsAppStack = new ProductsAppStack(app, 'ProductsAppStack', {
  tags: tags,
  env: env
});

// Criação da stack de API Gateway, conexão com o fetch handler da stack de products
const eCommerceApiStack = new ECommerceApiStack(app, 'ECommerceApiStack', {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  tags: tags,
  env: env
});

eCommerceApiStack.addDependency(productsAppStack);
