/**
 * Removes empty-string array slots and possible linebreaks
 * @param classArr raw className array from node
 * @return formatted array of classNames
 */
function sanitizeNode(classArr: string[]) {
  classArr = classArr
    .filter((elem:string) => {
      return elem !== "";
    })
    .map((elem:string) => {
      return elem.replace(/\r?\n|\r/g, '');
    });
  return classArr;
}

export { sanitizeNode };
