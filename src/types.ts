import { Config } from "@jest/types";
import { RawSourceMap } from "source-map";

export { Config };
export { Path } from "@jest/types/build/Config";

export interface Transformer<OptionType = unknown> {
  /**
   * Indicates if the transformer is capabale of instrumenting the code for code coverage.
   *
   * If V8 coverage is _not_ active, and this is `true`, Jest will assume the code is instrumented.
   * If V8 coverage is _not_ active, and this is `false`. Jest will instrument the code returned by this transformer using Babel.
   */
  canInstrument?: boolean;
  createTransformer?: (options?: OptionType) => Transformer;

  getCacheKey?: (
    sourceText: string,
    sourcePath: string,
    options: TransformOptions<OptionType>
  ) => string;

  process: (
    sourceText: string,
    sourcePath: string,
    options: TransformOptions<OptionType>
  ) => TransformedSource;
}

export interface TransformOptions<OptionType> {
  /**
   * If a transformer does module resolution and reads files, it should populate `cacheFS` so that
   * Jest avoids reading the same files again, improving performance. `cacheFS` stores entries of
   * <file path, file contents>
   */
  cacheFS: Map<string, string>;
  config: Config.ProjectConfig;
  /** A stringified version of the configuration - useful in cache busting */
  configString: string;
  instrument: boolean;
  // names are copied from babel: https://babeljs.io/docs/en/options#caller
  supportsDynamicImport: boolean;
  supportsExportNamespaceFrom: boolean;
  supportsStaticESM: boolean;
  supportsTopLevelAwait: boolean;
  /** the options passed through Jest's config by the user */
  transformerConfig: OptionType;
}

type TransformedSource =
  | { code: string; map?: RawSourceMap | string | null }
  | string;

// Config.ProjectConfig can be seen in in code [here](https://github.com/facebook/jest/blob/v26.6.3/packages/jest-types/src/Config.ts#L323)
// RawSourceMap comes from [`source-map`](https://github.com/mozilla/source-map/blob/0.6.1/source-map.d.ts#L6-L12)
