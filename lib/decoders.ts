import * as ts from "typescript";

export function literal(typeName: string): ts.CallExpression {
  return ts.createCall(ts.createIdentifier(typeName), [], []);
}
