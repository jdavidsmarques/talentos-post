import { Athlete } from './athlete.model';

export interface PostData {
  dateLocation: string;
  raceName: string;
  distance: string;
  athletes: Array<{ id: string; name: string; photo: string }>;
}

