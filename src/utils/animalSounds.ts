// Animal sound utility using Web Audio API
export type AnimalType =
  | "cat"
  | "dog"
  | "owl"
  | "fox"
  | "rabbit"
  | "bear"
  | "goose";

// Extend Window interface for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Simple sound generator using Web Audio API
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext ||
        AudioContext)();
    }
    return this.audioContext;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ): void {
    const ctx = this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  private playFrequencySequence(
    sequence: Array<{ freq: number; duration: number; type?: OscillatorType }>
  ): void {
    let currentTime = 0;
    sequence.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, note.type || "sine");
      }, currentTime * 1000);
      currentTime += note.duration;
    });
  }

  playAnimalSound(animal: AnimalType): void {
    try {
      switch (animal) {
        case "goose":
          // Quack sound - low frequency with quick modulation
          this.playFrequencySequence([
            { freq: 200, duration: 0.1, type: "square" },
            { freq: 180, duration: 0.1, type: "square" },
            { freq: 160, duration: 0.2, type: "square" },
          ]);
          break;

        case "dog":
          // Bark sound - sharp attack with quick decay
          this.playFrequencySequence([
            { freq: 150, duration: 0.05, type: "sawtooth" },
            { freq: 200, duration: 0.1, type: "sawtooth" },
            { freq: 100, duration: 0.15, type: "sawtooth" },
          ]);
          break;

        case "cat":
          // Meow sound - rising then falling tone
          this.playFrequencySequence([
            { freq: 400, duration: 0.2, type: "sine" },
            { freq: 600, duration: 0.2, type: "sine" },
            { freq: 300, duration: 0.3, type: "sine" },
          ]);
          break;

        case "owl":
          // Hoot sound - low, hollow tone
          this.playFrequencySequence([
            { freq: 250, duration: 0.4, type: "sine" },
            { freq: 200, duration: 0.4, type: "sine" },
          ]);
          break;

        case "fox":
          // Yip sound - high pitched quick sound
          this.playFrequencySequence([
            { freq: 800, duration: 0.1, type: "triangle" },
            { freq: 600, duration: 0.1, type: "triangle" },
            { freq: 500, duration: 0.1, type: "triangle" },
          ]);
          break;

        case "rabbit":
          // Soft squeak
          this.playFrequencySequence([
            { freq: 1000, duration: 0.08, type: "sine" },
            { freq: 800, duration: 0.08, type: "sine" },
          ]);
          break;

        case "bear":
          // Growl sound - low rumble
          this.playFrequencySequence([
            { freq: 80, duration: 0.3, type: "sawtooth" },
            { freq: 100, duration: 0.3, type: "sawtooth" },
            { freq: 60, duration: 0.4, type: "sawtooth" },
          ]);
          break;

        default:
          // Default goose quack
          this.playFrequencySequence([
            { freq: 200, duration: 0.1, type: "square" },
            { freq: 180, duration: 0.1, type: "square" },
            { freq: 160, duration: 0.2, type: "square" },
          ]);
      }
    } catch (error) {
      console.warn("Could not play animal sound:", error);
    }
  }
}

const soundGenerator = new SoundGenerator();

export function playAnimalSound(animal: AnimalType): void {
  soundGenerator.playAnimalSound(animal);
}

export function getAnimalFromAvatar(customAvatar: string | null): AnimalType {
  if (!customAvatar) return "goose";

  try {
    // Try to decode the base64 and check for data-animal attribute
    if (customAvatar.startsWith("data:image/svg+xml;base64,")) {
      const base64Data = customAvatar.split(",")[1];
      const svgContent = atob(base64Data);

      // Look for data-animal attribute
      const animalMatch = svgContent.match(/data-animal="([^"]+)"/);
      if (animalMatch && animalMatch[1]) {
        return animalMatch[1] as AnimalType;
      }
    }

    // Fallback to content-based detection
    const avatarLower = customAvatar.toLowerCase();
    if (avatarLower.includes("cat") || avatarLower.includes("kitty"))
      return "cat";
    if (avatarLower.includes("dog") || avatarLower.includes("pup"))
      return "dog";
    if (avatarLower.includes("owl") || avatarLower.includes("wise"))
      return "owl";
    if (avatarLower.includes("fox") || avatarLower.includes("clever"))
      return "fox";
    if (avatarLower.includes("rabbit") || avatarLower.includes("bunny"))
      return "rabbit";
    if (avatarLower.includes("bear") || avatarLower.includes("strong"))
      return "bear";
  } catch (error) {
    console.warn("Could not parse avatar for animal detection:", error);
  }

  return "goose"; // Default
}
