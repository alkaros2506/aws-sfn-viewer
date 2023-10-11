import * as React from "react";
import "./App.css";

import AWSSfnGraph from "./sfn/index";
import "./sfn/index.css";

const aslData = {
  Comment: "A description of my state machine",
  StartAt: "Create Consent Document",
  States: {
    "Create Consent Document": {
      Type: "Task",
      Resource: "arn:aws:states:::lambda:invoke",
      OutputPath: "$.Payload",
      Parameters: {
        FunctionName:
          "arn:aws:lambda:us-east-1:573484756499:function:nest_client_api_graphql:$LATEST",
        Payload: {
          graphql: {
            query:
              "mutation CoreAppCreatePatientConsentDocument($accountId: String!, $patientConsentId: String!) {\n  coreAppCreatePatientConsentDocument(accountId: $accountId, patientConsentId: $patientConsentId) {\n    id\n  }\n}",
            operation: "CoreAppCreatePatientConsentDocument",
            variables: {
              "accountId.$": "$.accountId",
              "patientConsentId.$": "$.patientConsentId",
            },
          },
        },
      },
      Retry: [
        {
          ErrorEquals: [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException",
          ],
          IntervalSeconds: 2,
          MaxAttempts: 6,
          BackoffRate: 2,
        },
      ],
      Next: "Success",
    },
    Success: {
      Type: "Succeed",
    },
  },
};

function App() {
  return (
    <AWSSfnGraph
      data={aslData}
      width={500}
      height={500}
      onError={console.log}
    />
  );
}

export default App;
