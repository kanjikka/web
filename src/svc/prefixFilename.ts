// On OSX file system is case insensitive
// so to avoid issues, let's prepend uppercase characters
// with U_
export function prefixFilenameCase(c: string) {
  // Sanity check
  // TODO: doesn't work because of
  // > '𠂤'.length
  // 2
  // https://github.com/komagata/eastasianwidth/issues/7#issue-792586640
  //  if (c.length !== 1) {
  //    throw new Error(
  //      `Expected a single point character, but '${c}' has ${c.length}'`
  //    );
  //  }

  // Only works for uppercase characters
  // since toUpper and toLower are idempotent for kanas
  const isUppercase = c.toUpperCase() === c && c.toLowerCase() !== c;

  if (isUppercase) {
    return "U_" + c;
  }

  return c;
}
