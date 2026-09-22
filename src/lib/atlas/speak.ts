import { speechForCountry } from "./languages";
import { localWord } from "./word-i18n";
import { kidsWordFor } from "./kids-words";
import type { MetricId } from "./types";

const VOICE_KEY = "meridian.kids.voice";

export function voiceEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(VOICE_KEY) !== "off";
}

export function setVoiceEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VOICE_KEY, on ? "on" : "off");
  if (!on) stopSpeaking();
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function allVoices(): SpeechSynthesisVoice[] {
  if (!canSpeak()) return [];
  return window.speechSynthesis.getVoices();
}

function pickVoice(locale?: string): SpeechSynthesisVoice | null {
  const voices = allVoices();
  if (voices.length === 0) return null;
  if (locale) {
    const wanted = locale.replace("_", "-").toLowerCase();
    const prefix = wanted.slice(0, 2);
    const exact =
      voices.find((v) => v.lang.replace("_", "-").toLowerCase() === wanted) ??
      voices.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(prefix));
    if (exact) return exact;
  }
  const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = english.length ? english : voices;
  return (
    pool.find((v) => /samantha|karen|moira|google us|google uk/i.test(v.name)) ??
    pool.find((v) => /female/i.test(v.name)) ??
    pool[0] ??
    null
  );
}

let warmed = false;

export function warmVoices() {
  if (!canSpeak() || warmed) return;
  warmed = true;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}

export function stopSpeaking() {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string, rate = 0.88, locale = "en-US") {
  if (!canSpeak() || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = locale;
  utter.rate = rate;
  utter.pitch = 1.04;
  const voice = pickVoice(locale);
  if (voice) {
    utter.voice = voice;
    if (!locale) utter.lang = voice.lang;
  }
  window.speechSynthesis.speak(utter);
}

export function speakWord(word: string) {
  speak(word, 0.76, "en-US");
}

export function speakSentence(text: string) {
  speak(text, 0.9, "en-US");
}

export function speakInCountry(text: string, iso3: string | null | undefined, rate = 0.8) {
  const info = speechForCountry(iso3);
  speak(text, rate, info.locale);
}

export function localPhrase(metricId: MetricId | string, iso3: string | null | undefined): {
  text: string;
  language: string;
  locale: string;
  tag: string;
} | null {
  const info = speechForCountry(iso3);
  const fromMetric = localWord(metricId, info.lang);
  const english = kidsWordFor(metricId as MetricId)?.speak;
  const fromEnglish = english ? localWord(english.toLowerCase(), info.lang) : null;
  const text = fromMetric ?? fromEnglish;
  if (!text) return null;
  return {
    text,
    language: info.language,
    locale: info.locale,
    tag: info.lang.toUpperCase(),
  };
}

export function speakLocalWord(metricId: MetricId | string, iso3: string | null | undefined) {
  const phrase = localPhrase(metricId, iso3);
  const info = speechForCountry(iso3);
  if (phrase) {
    speak(phrase.text, 0.78, phrase.locale);
    return;
  }
  const fallback = kidsWordFor(metricId as MetricId)?.speak ?? String(metricId);
  speak(fallback, 0.78, info.locale);
}
