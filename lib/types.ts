export type ShootMode = "before" | "after";

export type PhotoPair = {
  before: string | null;
  after: string | null;
};

export type Location = {
  id: string;
  name: string;
  before: string[];  // base64 dataURLs (resized)
  after: string[];
  createdAt: number;
};

export type LocationStatus = "empty" | "before-only" | "complete";
