export interface IGame {
  _id: string;
  roomCode: number;
  mainClaim?: {
    claim: string;
    votes: {
      convinced: number;
      not_convinced: number;
    };
  };
  reasons_in_play?: [reason: string, votes: number];
  created_at: any;
}
