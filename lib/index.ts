import { Decoder } from "type-safe-json-decoder";

export declare function generateDecoder<T extends object>(): Decoder<T>;
