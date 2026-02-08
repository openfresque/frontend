export function getFlagEmoji(
  code: string | undefined,
  type: 'country' | 'language'
): string {
  let targetCountryCode = code?.toUpperCase()

  if (type === 'language') {
    // Map common language codes to representative country codes for flags
    const langMap: Record<string, string> = {
      EN: 'GB', // English -> UK flag
      FR: 'FR', // French -> France flag
      DE: 'DE', // German -> Germany flag
      ES: 'ES', // Spanish -> Spain flag
      IT: 'IT', // Italian -> Italy flag
      PT: 'PT', // Portuguese -> Portugal flag
      NL: 'NL', // Dutch -> Netherlands flag
      JA: 'JP', // Japanese -> Japan flag
      // Add more mappings as needed
    }
    targetCountryCode = langMap[targetCountryCode || ''] || targetCountryCode
  }

  if (targetCountryCode && targetCountryCode.length === 2) {
    try {
      const codePoints = targetCountryCode
        .split('')
        .map(char => 127_397 + char.charCodeAt(0))
      return String.fromCodePoint(...codePoints)
    } catch (error) {
      console.error(
        `Could not generate flag emoji for ${type} code: ${code}`,
        error
      )
      return '🏳️' // Fallback flag
    }
  } else if (code) {
    console.warn(`Invalid ${type} code for flag emoji: ${code}`)
  }
  return '' // Return empty string if no valid code
}
