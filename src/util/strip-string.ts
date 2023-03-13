/**
 * Strips last occurence of given string from provided elem
 * @param className string that's meant to be stripped
 * @param at string at which the elem should be split
 * @return stripped string or null if string couldn't be split
 */
function stripString(className: string, at: string) {
  if(!className.includes(at)) {
    return null;
  }
  return className.substr(0, className.lastIndexOf(at));
}

export { stripString };
