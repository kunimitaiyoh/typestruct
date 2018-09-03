import * as path from "path";
import * as ts from "typescript";
import { Node, Program, SourceFile, TransformationContext, TransformerFactory, visitEachChild } from "typescript";

const index = path.join(__dirname, "index.ts");
const FUNCTION_NAME = "generateDecoder";

/**
 * @see https://github.com/kimamula/ts-transformer-keys/blob/master/transformer.ts
 *
 * @param program TypeScript program
 */
export default function(program: Program): TransformerFactory<SourceFile> {
  return (context: TransformationContext) => (file: SourceFile) => visitNodeAndChildren(file, program, context);
}

function visitNodeAndChildren(node: SourceFile, program: Program, context: TransformationContext): SourceFile;
function visitNodeAndChildren(node: Node, program: Program, context: TransformationContext): Node;
function visitNodeAndChildren(node: Node, program: Program, context: TransformationContext): Node {
  return visitEachChild(visitNode(node, program), childNode => {
    return visitNodeAndChildren(childNode, program, context);
  }, context);
}

function visitNode(node: ts.Node, program: ts.Program): Node {
  const typeChecker = program.getTypeChecker();
  if (!isDecoderGeneration(node, typeChecker)) {
    return node;
  }
  if (!node.typeArguments) {
    throw new Error("type argument is required.");
  }
  const type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
  return buildDecoder(type, typeChecker);
}

function isDecoderGeneration(node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression {
  if (node.kind !== ts.SyntaxKind.CallExpression) {
    return false;
  }
  const signature = typeChecker.getResolvedSignature(node as ts.CallExpression);
  if (typeof signature === "undefined") {
    return false;
  }

  if (signature.declaration !== undefined && signature.declaration.kind === ts.SyntaxKind.CallSignature) {
    const declaration: ts.CallSignatureDeclaration = signature.declaration;
    return path.join(declaration.getSourceFile().fileName) === index
      && declaration.name !== undefined
      && declaration.name.getText() === FUNCTION_NAME;
  } else {
    return false;
  }
}

function buildDecoder(type: ts.Type, typeChecker: ts.TypeChecker): ts.CallExpression {
  throw new Error("not implemented!");
}