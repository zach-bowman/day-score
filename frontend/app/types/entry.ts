export interface Entry {
  id: number;
  date: string;
  score: number;
  note: string | null;
}

export interface CreateEntryRequest {
  date: string;
  score: number;
  note: string | null;
}

export interface UpdateEntryRequest {
  score: number;
  note: string | null;
}
