// toTitleCase --> "Hello World  ---> Hello world"
export function toTitleCase(sentence) {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}
