import { Kanji } from "@/models/kanji.schema";

function getBaseURL() {
  return process.env.NEXT_PUBLIC_BASE_URL;
}

function handleResponse(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export async function getIdeograms(
  query: string
): Promise<{ characters: Kanji[]; fail: any }> {
  return fetch(`${getBaseURL()}/api/ideograms/${query}`)
    .then(handleResponse)
    .then();
}
