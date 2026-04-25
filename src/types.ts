export interface CharacterProfile {
  gender: string;
  hairstyle: string;
  vibe: string;
  clothing: string;
}

export interface UserData {
  character: CharacterProfile;
  futureGoals: string;
}

export interface Scene {
  id: number;
  imagePrompt: string;
  voiceover: string;
  subtitle: string;
  duration: number;
  imageUrl?: string;
  audioUrl?: string;
}

export interface VlogScript {
  title: string;
  scenes: Scene[];
}

export interface HistoryEntry {
  id: string;
  date: string;
  gratitudes: string[];
  script: VlogScript;
}
