/**
 * Function to escape potential symbols in a className string that could break a regex test, because they're not escaped.
 * @param string
 */
function escapeClassname(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export {escapeClassname}
