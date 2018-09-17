import * as path from "path";
import * as ts from "typescript";
import transformer from "../lib/transformer";

compile([path.join(__dirname, "../../test/transformer.spec.ts")]);

function compile(files: string[]): void {
  const program = ts.createProgram(files, {
    strict: true,
    noEmitOnError: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    sourceMap: true,
  });
  const transformers: ts.CustomTransformers = {
    before: [transformer(program)],
  };

  const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, false, transformers);
  if (emitSkipped) {
    throw new Error(diagnostics.map(d => d.messageText).join("\n"));
  }
}
