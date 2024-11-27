import { CharacterSchema, Kanji } from "../models/kanji.schema";
import { prefixFilenameCase } from "./prefixFilename";

export function getBackendURL() {
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  // TODO: centralize somewhere else?
  if (process.env.NEXT_PUBLIC_API_URL === undefined) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  return process.env.NEXT_PUBLIC_API_URL;
}

export function getAllCharacters(wordOrPhrase: string): Promise<Kanji[]> {
  // Break into individual characters
  const chars = wordOrPhrase
    .split("")
    // Remove spaces
    .filter((a) => a.trim().length);

  // Only unique
  const uniq = [...new Set(chars)];

  return Promise.all(uniq.map(getKanji));
}

export function getKanji(ch: string): Promise<Kanji> {
  const url = getBackendURL();
  const c = prefixFilenameCase(ch);

  return fetch(`${url}/svg/${c}.json`)
    .then(handleResponse)
    .then(CharacterSchema.parse)
    .then((svg) => {
      // sanity check
      if (svg.name !== ch) {
        throw new Error(
          `SVG name: '${svg.name}' is different from character: '${ch}'`
        );
      }
      return {
        name: ch,
        svg,
      };
    });
}

function handleResponse(response: Response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
