export function sortArrayOfObjects(array, key) {
  const sortedArray = [...array];
  sortedArray.sort((a, b) => a[key] - b[key]);
  return sortedArray;
}
