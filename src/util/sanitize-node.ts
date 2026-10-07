/**
 * Removes empty-string array slots and possible linebreaks
 * @param classArr raw className array from node
 * @returns {Array<string>} formatted array of classNames
 */
function sanitizeNode(classArr: Array<string>): Array<string> {
  return classArr.flatMap(elem => elem.split(/\s+/)).filter(Boolean);
}

function hasLeadingWhitespace(str: string): boolean {
  return /^\s+/.test(str);
}

function hasTrailingWhitespace(str: string): boolean {
  return /\s+$/.test(str);
}

export { sanitizeNode, hasLeadingWhitespace, hasTrailingWhitespace };
