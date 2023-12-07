import { z } from "zod";

// TODO move
//const schema = z.object({
//  query: z.string(),
//  found: z.literal(true), // don't care if it's false
//  strokeCount: z.number(),
//  meaning: z.string(),
//  strokeOrderDiagramUri: z.string(),
//  strokeOrderSvgUri: z.string(),
//  strokeOrderGifUri: z.string(),
//  parts: z.array(z.string()),
//});
export const SvgSchema = z.object({
  individualWidth: z.number().default(109),
  templateFilename: z.string(),
  strokeOrderFilename: z.string(),

  width: z.number(),
  height: z.number(),
});

export const KanjiSchema = z.object({
  name: z.string(),
  svg: SvgSchema,
});

export type Svg = ReturnType<typeof SvgSchema.parse>;
export type Kanji = ReturnType<typeof KanjiSchema.parse>;
