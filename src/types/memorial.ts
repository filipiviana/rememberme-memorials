
export interface AudioFile {
  url: string;
  title: string;
  duration?: number;
}

export interface Memorial {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  tribute: string;
  biography: string;
  profilePhoto: string;
  coverPhoto: string;
  photos: string[];
  videos: string[];
  audios?: AudioFile[];
  slug: string;
  createdAt: string;
}
