export interface IReason {
  _id: string;
  reason: string;
  plausible_votes: number;
  not_plausible_votes?: number;
  game_id: string;
}
