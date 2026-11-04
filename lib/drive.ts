
export function extractDriveId(input: string): string | null {
  const value = input.trim();

  if (/^[a-zA-Z0-9_-]{15,}$/.test(value)) {
    return value;
  }

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/uc\?.*id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function drivePreviewUrl(input: string): string | null {
  const id = extractDriveId(input);

  return id
    ? `https://drive.google.com/file/d/${id}/preview`
    : null;
}
