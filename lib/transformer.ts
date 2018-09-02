import * as path from "path";
import * as ts from "typescript";
import { Node, Program, SourceFile, TransformationContext, TransformerFactory, visitEachChild } from "typescript";

const index = path.join(__dirname, "index.ts");

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
  throw new Error("not implemented!");
}
