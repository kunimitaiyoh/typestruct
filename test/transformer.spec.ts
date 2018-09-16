import * as assert from "assert";
import { generateDecoder } from "../lib/index";

const userDecoder = generateDecoder<User>();

describe("generateDecoder", () => {
  const expected: User = {
    id: 42,
    name: "Jane Doe",
  };
  assert.deepStrictEqual(expected, userDecoder.decodeJSON('{ "id": 42, "name": "Jane Doe" }'));
});

interface User {
  id: number;
  name: string;
}
