function tileImg(assistEnabled: boolean, c?: string) {
  if (!assistEnabled || !c) {
    return "url(/kanji-template/template.svg)";
  }

  return `url(/kanji-template/${c}.svg)`;
}

export type TileStructure = {
  character?: string;
  readOnly: boolean;
};

// Abstract the tile generation
type TilesEngineProps = {
  maxWidth: number;
  tileWidth: number;
  word: string;
};
export function TilesEngine(p: TilesEngineProps): TileStructure[] {
  const { word, maxWidth, tileWidth } = p;

  const columns = Math.floor(maxWidth / tileWidth);
  const numRows = Math.ceil(word.length / columns);
  //  const numRows = 7;
  const numTiles = numRows * columns;
  console.log({ numRows });

  // Single kanji
  if (word.length === 1) {
    const tile = {
      character: word[0],
      readOnly: false,
    };

    return Array.from(Array(numTiles)).map(() => tile);
  }

  // Word or sentence
  const tiles: TileStructure[] = Array.from(Array(numTiles));
  for (let i = 0; i < numTiles; i++) {
    if (word[i]) {
      tiles[i] = {
        character: word[i],
        readOnly: false,
      };
    } else {
      // Pad
      tiles[i] = {
        readOnly: true,
      };
    }
  }

  return tiles;
}
