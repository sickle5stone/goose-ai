import type { Message } from "../types";

export type AnimalType =
  | "cat"
  | "dog"
  | "owl"
  | "fox"
  | "rabbit"
  | "bear"
  | "goose";

export interface AnimalColorScheme {
  border: string;
  text: string;
  focusBorder: string;
  placeholder: string;
}

// Animal color schemes
export const getAnimalColorScheme = (animal: string): AnimalColorScheme => {
  switch (animal) {
    case "goose":
      return {
        border: "border-orange-500",
        text: "text-orange-500",
        focusBorder: "focus:border-yellow-500",
        placeholder: "placeholder:text-yellow-500",
      };
    case "dog":
      return {
        border: "border-amber-600",
        text: "text-amber-700",
        focusBorder: "focus:border-amber-500",
        placeholder: "placeholder:text-amber-400",
      };
    case "cat":
      return {
        border: "border-gray-300",
        text: "text-gray-600",
        focusBorder: "focus:border-gray-400",
        placeholder: "placeholder:text-gray-400",
      };
    case "bear":
      return {
        border: "border-amber-800",
        text: "text-amber-900",
        focusBorder: "focus:border-amber-700",
        placeholder: "placeholder:text-amber-600",
      };
    case "owl":
      return {
        border: "border-indigo-500",
        text: "text-indigo-600",
        focusBorder: "focus:border-indigo-400",
        placeholder: "placeholder:text-indigo-400",
      };
    case "fox":
      return {
        border: "border-orange-600",
        text: "text-orange-700",
        focusBorder: "focus:border-orange-500",
        placeholder: "placeholder:text-orange-400",
      };
    case "rabbit":
      return {
        border: "border-pink-300",
        text: "text-pink-500",
        focusBorder: "focus:border-pink-400",
        placeholder: "placeholder:text-pink-300",
      };
    default:
      return {
        border: "border-orange-500",
        text: "text-orange-500",
        focusBorder: "focus:border-yellow-500",
        placeholder: "placeholder:text-yellow-500",
      };
  }
};

// Simple animal SVGs collection
export const animalAvatars = {
  cat: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="36" r="20" fill="#FFA500" stroke="#FF8C00" stroke-width="2"/>
    <circle cx="25" cy="30" r="3" fill="#333"/>
    <circle cx="39" cy="30" r="3" fill="#333"/>
    <path d="M20 20 L26 26 L20 32 Z" fill="#FFA500" stroke="#FF8C00" stroke-width="1"/>
    <path d="M44 20 L38 26 L44 32 Z" fill="#FFA500" stroke="#FF8C00" stroke-width="1"/>
    <path d="M28 36 Q32 40 36 36" stroke="#333" stroke-width="2" fill="none"/>
    <circle cx="32" cy="34" r="2" fill="#FFB6C1"/>
  </svg>`,

  dog: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="38" rx="18" ry="16" fill="#8B4513" stroke="#654321" stroke-width="2"/>
    <ellipse cx="20" cy="25" rx="6" ry="10" fill="#8B4513" stroke="#654321" stroke-width="1"/>
    <ellipse cx="44" cy="25" rx="6" ry="10" fill="#8B4513" stroke="#654321" stroke-width="1"/>
    <circle cx="26" cy="32" r="3" fill="#333"/>
    <circle cx="38" cy="32" r="3" fill="#333"/>
    <ellipse cx="32" cy="40" rx="4" ry="6" fill="#333"/>
    <path d="M28 44 Q32 48 36 44" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`,

  owl: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="36" rx="20" ry="24" fill="#8B7355" stroke="#5D4E37" stroke-width="2"/>
    <circle cx="24" cy="28" r="8" fill="#FFF" stroke="#333" stroke-width="1"/>
    <circle cx="40" cy="28" r="8" fill="#FFF" stroke="#333" stroke-width="1"/>
    <circle cx="24" cy="28" r="4" fill="#333"/>
    <circle cx="40" cy="28" r="4" fill="#333"/>
    <path d="M30 35 L32 38 L34 35 Z" fill="#FF6B35"/>
    <path d="M20 18 L24 22 L20 26" stroke="#8B7355" stroke-width="3" fill="none"/>
    <path d="M44 18 L40 22 L44 26" stroke="#8B7355" stroke-width="3" fill="none"/>
  </svg>`,

  fox: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 20 L20 35 L44 35 Z" fill="#FF6B35" stroke="#E55A2B" stroke-width="2"/>
    <circle cx="32" cy="42" r="16" fill="#FF6B35" stroke="#E55A2B" stroke-width="2"/>
    <path d="M18 15 L25 25 L15 28 Z" fill="#FF6B35" stroke="#E55A2B" stroke-width="1"/>
    <path d="M46 15 L39 25 L49 28 Z" fill="#FF6B35" stroke="#E55A2B" stroke-width="1"/>
    <circle cx="26" cy="35" r="3" fill="#333"/>
    <circle cx="38" cy="35" r="3" fill="#333"/>
    <circle cx="32" cy="40" r="2" fill="#333"/>
    <path d="M28 44 Q32 47 36 44" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`,

  rabbit: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="40" r="18" fill="#F5F5DC" stroke="#DDD" stroke-width="2"/>
    <ellipse cx="24" cy="18" rx="4" ry="12" fill="#F5F5DC" stroke="#DDD" stroke-width="1"/>
    <ellipse cx="40" cy="18" rx="4" ry="12" fill="#F5F5DC" stroke="#DDD" stroke-width="1"/>
    <ellipse cx="24" cy="20" rx="2" ry="8" fill="#FFB6C1"/>
    <ellipse cx="40" cy="20" rx="2" ry="8" fill="#FFB6C1"/>
    <circle cx="26" cy="36" r="3" fill="#333"/>
    <circle cx="38" cy="36" r="3" fill="#333"/>
    <circle cx="32" cy="42" r="2" fill="#FFB6C1"/>
    <path d="M28 46 Q32 49 36 46" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`,

  bear: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="38" r="20" fill="#8B4513" stroke="#654321" stroke-width="2"/>
    <circle cx="20" cy="24" r="8" fill="#8B4513" stroke="#654321" stroke-width="1"/>
    <circle cx="44" cy="24" r="8" fill="#8B4513" stroke="#654321" stroke-width="1"/>
    <circle cx="26" cy="34" r="3" fill="#333"/>
    <circle cx="38" cy="34" r="3" fill="#333"/>
    <ellipse cx="32" cy="42" rx="3" ry="4" fill="#333"/>
    <path d="M26 46 Q32 50 38 46" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`,
};

// Smart animal selection based on conversation and name
export const selectAnimalAvatar = (
  name: string,
  conversationHistory: Message[]
) => {
  const allText = conversationHistory
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.message.toLowerCase())
    .join(" ");

  const nameLower = name.toLowerCase();

  // Direct name matching
  if (nameLower.includes("cat") || nameLower.includes("kitty")) return "cat";
  if (nameLower.includes("dog") || nameLower.includes("pup")) return "dog";
  if (nameLower.includes("owl") || nameLower.includes("wise")) return "owl";
  if (nameLower.includes("fox") || nameLower.includes("clever")) return "fox";
  if (nameLower.includes("rabbit") || nameLower.includes("bunny"))
    return "rabbit";
  if (nameLower.includes("bear") || nameLower.includes("strong")) return "bear";

  // Personality-based selection
  if (/wise|smart|learn|study|book|research|academic/.test(allText))
    return "owl";
  if (/creative|art|design|music|paint|draw|imagination/.test(allText))
    return "fox";
  if (/loyal|friend|help|support|team|together/.test(allText)) return "dog";
  if (/cute|sweet|gentle|soft|kind|caring/.test(allText)) return "rabbit";
  if (/independent|cool|sleek|elegant|sophisticated/.test(allText))
    return "cat";
  if (/strong|powerful|protect|bold|confident/.test(allText)) return "bear";

  // Tech vs Creative bias
  if (/code|program|develop|tech|software|ai|computer/.test(allText))
    return "owl";
  if (/travel|explore|adventure|discovery|journey/.test(allText)) return "fox";

  // Default based on name hash for consistency
  const nameHash = name.split("").reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);

  const animals = ["cat", "dog", "owl", "fox", "rabbit", "bear"];
  return animals[Math.abs(nameHash) % animals.length];
};

// Generate personalized avatar
export const generatePersonalizedAvatar = (
  name: string,
  conversationHistory: Message[]
) => {
  const selectedAnimal = selectAnimalAvatar(name, conversationHistory);
  const svgString = animalAvatars[selectedAnimal as keyof typeof animalAvatars];

  // Create a data URL with the animal type embedded for later sound detection
  const modifiedSvg = svgString.replace(
    "<svg",
    `<svg data-animal="${selectedAnimal}"`
  );

  return `data:image/svg+xml;base64,${btoa(modifiedSvg)}`;
};
