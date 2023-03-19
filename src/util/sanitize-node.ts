/**
 * Removes empty-string array slots and possible linebreaks
 * @param classArr raw className array from node
 * @returns {Array<string>} formatted array of classNames
 */
function sanitizeNode(classArr: string[]): string[] {
  classArr = classArr
    .filter((elem:string) => {
      return elem !== "";
    })
    .map((elem:string) => {
      return elem.replace(/\r?\n|\r/g, '');
    });
  return classArr;
}

function hasLeadingWhitespace(str: string): boolean {
  return /^\s+/.test(str);
}

function hasTrailingWhitespace(str: string): boolean {
  return /\s+$/.test(str);
}

export { sanitizeNode, hasLeadingWhitespace, hasTrailingWhitespace };
