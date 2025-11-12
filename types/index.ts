export interface TBookmark {
  emoji?: string;
  label?: string;
  url?: string;
}

export interface BookmarkData {
  urls: TBookmark[];
}
