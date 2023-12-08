import { z } from "zod";

//import camelcaseKeys from "camelcase-keys";
//import { CamelCasedPropertiesDeep } from "type-fest"; // need CamelCasedPropertiesDeep because of https://github.com/sindresorhus/camelcase-keys/issues/77#issuecomment-1339844470

// Source: https://github.com/colinhacks/zod/issues/486#issuecomment-1567296747
//export const zodToCamelCase = <T extends z.ZodTypeAny>(
//  zod: T
//): z.ZodEffects<z.infer<T>, CamelCasedPropertiesDeep<T["_output"]>> =>
//  zod.transform((val) => camelcaseKeys(val) as CamelCasedPropertiesDeep<T>);
//const camelize = <T extends readonly unknown[] | Record<string, unknown>>(
//  val: T
//) => camelcaseKeys(val);

export const ExampleSentenceDTOSchema = z.object({
  // TODO: enum
  source: z.string(),
  audio_japanese: z.string(),
  japanese: z.string(),
  english: z.string(),
});

export const ExampleSentenceSchema = ExampleSentenceDTOSchema.transform((a) => {
  return {
    source: a.source,
    japaneseSentence: a.japanese,
    englishSentence: a.english,
    audioJapanese: a.audio_japanese,
  };
});

export type ExampleSentence = z.infer<typeof ExampleSentenceSchema>;
