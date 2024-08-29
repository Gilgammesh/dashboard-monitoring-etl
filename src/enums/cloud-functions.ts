export enum CloudFunctionValue {
  Sap = "cf-etl-sap",
  Oracle = "cf-etl-oracle",
}

export enum CloudFunctionName {
  Sap = "CF Sap",
  Oracle = "CF Oracle",
}

export enum CloudFunctionScheduler {
  Delta = "delta",
  Recovery = "recovery",
  Massive = "massive",
}

export enum CloudFunctionStatus {
  Recovered = "recuperado",
  Failed = "fallido",
}
