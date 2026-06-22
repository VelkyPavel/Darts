import type { Language } from './translations';

export interface ParsedThrow {
  value: number;
  isDouble: boolean;
}

/**
 * Per-language vocabulary for parsing a dart throw from a speech transcript.
 *
 * Every word/phrase here MUST be stored in NORMALIZED form: lowercased and with
 * diacritics stripped (e.g. Czech "padesát" -> "padesat"), because the incoming
 * transcript is normalized the same way before matching (see `normalize`).
 * Russian keeps its Cyrillic characters (no diacritics to strip).
 *
 * `numberWords` maps a single normalized word to its numeric value. Compound
 * numbers are handled by summing the values of every recognized word, so
 * "padesat ctyri" -> 50 + 4 = 54 and "dvacet" -> 20.
 */
interface LangVocab {
  /** Idiomatic "miss" words (e.g. "vedle", "pudło", "промах"). -> (0, false) */
  miss: string[];
  /** Outer bull -> (25, false) */
  bull: string[];
  /** Bullseye phrases -> (50, true). Multi-word phrases are allowed. */
  bullseye: string[];
  /** Multiplier keywords that mean "double" (x2). */
  double: string[];
  /** Multiplier keywords that mean "triple" (x3). */
  triple: string[];
  /** Single-word number -> value, in normalized form. */
  numberWords: Record<string, number>;
}

/** BCP-47 language tags consumed by the Web Speech API `lang` property. */
export const SPEECH_LANG_CODE: Record<Language, string> = {
  en: 'en-US',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  pl: 'pl-PL',
  ru: 'ru-RU',
};

const VOCAB: Record<Language, LangVocab> = {
  en: {
    miss: ['miss', 'missed', 'off', 'outside', 'no score'],
    bull: ['bull'],
    bullseye: ['bullseye', 'bulls eye', 'bullseye'],
    double: ['double', 'd'],
    triple: ['triple', 'treble', 't', 'trips'],
    numberWords: {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
      seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
      thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
      eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
      fifty: 50, sixty: 60,
    },
  },
  cs: {
    miss: ['vedle', 'mimo', 'nic', 'miss'],
    bull: ['byk', 'bull'],
    bullseye: ['byci oko', 'byciho oka', 'oko', 'bullseye', 'bulls eye'],
    double: ['dvojnasobne', 'dvojnasek', 'dvojite', 'dvojnasobek', 'dvoj', 'double', 'd'],
    triple: ['trojnasobne', 'trojite', 'trojnasobek', 'troj', 'triple', 't'],
    numberWords: {
      nula: 0, jedna: 1, jednu: 1, dva: 2, dve: 2, tri: 3, ctyri: 4, pet: 5,
      sest: 6, sedm: 7, osm: 8, devet: 9, deset: 10, jedenact: 11, dvanact: 12,
      trinact: 13, ctrnact: 14, patnact: 15, sestnact: 16, sedmnact: 17,
      osmnact: 18, devatenact: 19, dvacet: 20, tricet: 30, ctyricet: 40,
      padesat: 50, sedesat: 60,
    },
  },
  sk: {
    miss: ['vedla', 'mimo', 'nic', 'miss'],
    bull: ['byk', 'bull'],
    bullseye: ['bycie oko', 'bycieho oka', 'oko', 'bullseye', 'bulls eye'],
    double: ['dvojnasobok', 'dvojite', 'dvoj', 'double', 'd'],
    triple: ['trojnasobok', 'trojite', 'troj', 'triple', 't'],
    numberWords: {
      nula: 0, jedna: 1, jeden: 1, dva: 2, dve: 2, tri: 3, styri: 4, pat: 5,
      sest: 6, sedem: 7, osem: 8, devat: 9, desat: 10, jedenast: 11, dvanast: 12,
      trinast: 13, strnast: 14, patnast: 15, sestnast: 16, sedemnast: 17,
      osemnast: 18, devatnast: 19, dvadsat: 20, dvadsiat: 20, tridsat: 30,
      styridsat: 40, patdesiat: 50, sestdesiat: 60,
    },
  },
  pl: {
    miss: ['pudlo', 'mimo', 'nic', 'miss'],
    bull: ['byk', 'bull'],
    bullseye: ['bykie oko', 'oko', 'bullseye', 'bulls eye'],
    double: ['podwojne', 'podwojny', 'dabl', 'double', 'd'],
    triple: ['potrojne', 'potrojny', 'tribl', 'triple', 't'],
    numberWords: {
      zero: 0, jeden: 1, jedna: 1, jedno: 1, dwa: 2, dwie: 2, trzy: 3,
      cztery: 4, piec: 5, szesc: 6, siedem: 7, osiem: 8, dziewiec: 9,
      dziesiec: 10, jedenascie: 11, dwanascie: 12, trzynascie: 13,
      czternascie: 14, pietnascie: 15, szesnascie: 16, siedemnascie: 17,
      osiemnascie: 18, dziewietnascie: 19, dwadziescia: 20, trzydziesci: 30,
      czterdziesci: 40, piecdziesiat: 50, szescdziesiat: 60,
    },
  },
  ru: {
    miss: ['промах', 'мимо', 'молоко', 'мисс', 'miss'],
    bull: ['буль', 'бык', 'bull'],
    bullseye: ['бычий глаз', 'булл ай', 'буллай', 'глаз', 'bullseye', 'bulls eye'],
    double: ['двойное', 'двойной', 'дабл', 'double', 'д'],
    triple: ['тройное', 'тройной', 'трибл', 'triple', 'т'],
    numberWords: {
      ноль: 0, нуль: 0, один: 1, одна: 1, одно: 1, два: 2, две: 2, три: 3,
      четыре: 4, пять: 5, шесть: 6, семь: 7, восемь: 8, девять: 9, десять: 10,
      одиннадцать: 11, двенадцать: 12, тринадцать: 13, четырнадцать: 14,
      пятнадцать: 15, шестнадцать: 16, семнадцать: 17, восемнадцать: 18,
      девятнадцать: 19, двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50,
      шестьдесят: 60,
    },
  },
};

/**
 * Normalize a transcript for matching: lowercase, strip diacritics (so Czech
 * "padesát" matches the stored "padesat"), drop punctuation, collapse spaces.
 * Cyrillic is preserved (it has no combining diacritics to worry about here).
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .replace(/[^\p{L}\p{N}\s]/gu, '') // keep letters/numbers/spaces only
    .trim()
    .replace(/\s+/g, ' ');
}

/** True if `phrase` appears in `text` as a whole word/phrase (unicode-aware). */
function containsPhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u');
  return re.test(text);
}

/** Remove the first occurrence of `phrase` (whole-word) from `text`. */
function removePhrase(text: string, phrase: string): string {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u');
  return text.replace(re, ' ').replace(/\s+/g, ' ').trim();
}

/** Sum every recognized number word in `text`; returns null if none found. */
function sumNumberWords(text: string, map: Record<string, number>): number | null {
  const m = text.match(/\d+/);
  if (m) {
    const n = parseInt(m[0], 10);
    return Number.isFinite(n) ? n : null;
  }
  const words = text.split(' ').filter(Boolean);
  let total = 0;
  let found = false;
  for (const w of words) {
    const v = map[w];
    if (v !== undefined) {
      total += v;
      found = true;
    }
  }
  return found ? total : null;
}

/**
 * Parse a speech transcript into a dart throw.
 *
 * Recognizes, in order: miss, bullseye (50, double), bull (25), then an
 * optional multiplier (double/triple) followed by a base number (word or digit,
 * including compounds like "padesat ctyri" = 54). Returns null if nothing valid
 * could be parsed.
 *
 * The output matches the existing `onScore(value, isDouble)` contract: `value`
 * is the already-multiplied score and `isDouble` is true only for doubles and
 * the bullseye (triples collapse to isDouble:false, same as the keyboard).
 */
export function parseThrow(transcript: string, language: Language): ParsedThrow | null {
  const vocab = VOCAB[language];
  const text = normalize(transcript);

  if (!text) return null;

  // 1. Miss -> 0
  if (vocab.miss.some((p) => containsPhrase(text, p))) {
    return { value: 0, isDouble: false };
  }

  // 2. Bullseye -> 50 (counts as a double for double-out)
  if (vocab.bullseye.some((p) => containsPhrase(text, p))) {
    return { value: 50, isDouble: true };
  }

  // 3. Bull -> 25
  if (vocab.bull.some((p) => containsPhrase(text, p))) {
    return { value: 25, isDouble: false };
  }

  // 4. Multiplier
  let multiplier = 1;
  let cleaned = text;
  for (const kw of vocab.double) {
    if (containsPhrase(text, kw)) {
      multiplier = 2;
      cleaned = removePhrase(text, kw);
      break;
    }
  }
  if (multiplier === 1) {
    for (const kw of vocab.triple) {
      if (containsPhrase(text, kw)) {
        multiplier = 3;
        cleaned = removePhrase(text, kw);
        break;
      }
    }
  }

  // 5. Base number
  const base = sumNumberWords(cleaned, vocab.numberWords);
  if (base === null) return null;

  // 6. Validate + apply multiplier.
  // Doubles/triples only exist on the 1-20 segments; any single score 0-60 is valid.
  if (multiplier > 1) {
    if (base < 1 || base > 20) return null;
  } else {
    if (base < 0 || base > 60) return null;
  }

  return {
    value: base * multiplier,
    isDouble: multiplier === 2,
  };
}
