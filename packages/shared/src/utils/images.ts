export function extractNoscriptImageUrls(html: string, pattern: string) {
  const regex = new RegExp(pattern, 'gi');
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html))) {
    matches.push(match[1]);
  }
  return matches;
}
