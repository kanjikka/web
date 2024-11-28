import { TilesEngine } from "./TilesEngine";

describe("Tiles", () => {
  describe("TilesEngine", () => {
    describe("There's a single kanji", () => {
      it("fills every tile with that kanji", () => {
        const res = TilesEngine({
          maxWidth: 100,
          tileWidth: 10,
          word: "食",
        });

        // 10 columns, default 7 rows
        expect(res).toHaveLength(70);
        res.forEach((a) => {
          expect(a.character).toBe("食");
        });
      });
    });

    describe("there's a word", () => {
      const res = TilesEngine({
        maxWidth: 100,
        tileWidth: 10,
        word: "食べる",
      });

      it("it fills the entire row, then it pads with space", () => {
        // 10 columns, default 7 rows
        expect(res).toHaveLength(70);
        const characters = res.map((a) => a.character).join("");
        const spaces = characters.length - characters.trim().length;

        expect(characters.trim()).toBe("食べる");
        expect(spaces).toBe(67);

        // TODO: spaces should be readonly
      });
    });
  });
});
