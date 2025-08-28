export function toDataUrl(input?: string | null, mime = 'image/jpeg') {
  if (!input) return '';
  if (input.startsWith('data:')) return input;
  const clean = input.replace(/\s/g, '');
  return `data:${mime};base64,${clean}`;
}