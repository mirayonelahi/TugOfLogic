import { Service, Inject } from 'typedi';
import { createHash } from 'crypto';

@Service()
export default class GameService {
  readonly mainClaim = 'mainClaim';
  readonly state = 'state';
  readonly convinced = 'convinced';
  readonly notYetPersuaded = 'notYetPersuaded';
  readonly reasons = 'reasons';
  readonly discuss = 'discuss';
  readonly ignore = 'ignore';
  readonly established = 'established';
  readonly contested = 'contested';
  readonly playerName = 'playerName';
  readonly reason = 'reason';
  readonly _id = '_id'; // setting reason id key
  readonly skirmish = 'skirmish';
  readonly establishedGrounds = 'establishedGrounds';
  readonly initVoteCount = 0;
  readonly upVote = 1;
  readonly downVote = -1;
  readonly states = {
    land: 'land',
    strawpoll: 'strawpoll',
    saywhy: 'saywhy',
    bout: 'bout',
    endpoll: 'endpoll',
  };

  constructor(@Inject('logger') private logger, @Inject('db') private db) {}

  public createNewGame(game: { roomCode: string; mainClaim: string }): Promise<any> {
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        const convincedVoters = await this.db.exists(`${game.roomCode}:${this.convinced}`);
        const contestestedVoters = await this.db.exists(`${game.roomCode}:${this.notYetPersuaded}`);
        if (parseInt(convincedVoters) == 1) {
          await this.db.del(`${game.roomCode}:${this.convinced}`);
        }
        if (parseInt(contestestedVoters) == 1) {
          await this.db.del(`${game.roomCode}:${this.notYetPersuaded}`);
        }
        await self.db.hset(game.roomCode, this.mainClaim, game.mainClaim);
        await self.db.hset(game.roomCode, this.state, this.states.strawpoll);
        await self.db.hset(game.roomCode, this.convinced, this.initVoteCount);
        await self.db.hset(game.roomCode, this.notYetPersuaded, this.initVoteCount);
      } catch (error) {
        self.logger.error(error);
        reject(error);
      }
    });
  }

  private hashReasonCode(reason: string): string {
    const hash = createHash('sha1').update(reason, 'utf-8').digest('hex').toString();
    return hash.substring(0, 10);
  }

  public generateRoomCode(): string {
    let result = '';
    const size = 6;
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    for (let i = 0; i < size; i++) {
      const index: number = Math.floor(Math.random() * characters.length);
      result += characters[index];
    }
    return result;
  }

  public async getGameState(roomCode: string) {
    try {
      const gameState = {
        room: null,
        reasonsToPlay: null,
        reasonInPlay: null,
        establishedGrounds: null,
      };
      const mainClaim = await this.getGameMainClaim(roomCode);
      gameState.room = mainClaim;
      const doReasonsToPlayExist = await this.db.exists(`${roomCode}:${this.reasons}`);
      if (parseInt(doReasonsToPlayExist) === 1) {
        const reasonsToPlayIds = await this.getGameReasonsToPlayIds(roomCode);
        const reasonsToPlay = await this.getGameReasonsToPlay(roomCode, reasonsToPlayIds);
        gameState.reasonsToPlay = reasonsToPlay;
      }
      const reasonInPlay = await this.getReasonInPlay(roomCode);
      gameState.reasonInPlay = reasonInPlay;
      const establishedGrounds = await this.getEstablishedGrounds(roomCode);
      gameState.establishedGrounds = establishedGrounds;
      return gameState;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getGameMainClaim(roomCode: string) {
    try {
      let mainClaimState;
      const gamePhase = await this.db.hget(roomCode, this.state);
      if (gamePhase === this.states.endpoll) {
        mainClaimState = await this.db.hgetall(`${roomCode}:${this.states.endpoll}`);
        mainClaimState = {
          ...mainClaimState,
          convinced: parseInt(mainClaimState.convinced),
          notYetPersuaded: parseInt(mainClaimState.notYetPersuaded),
        };
      } else {
        mainClaimState = await this.db.hgetall(roomCode);
        mainClaimState = {
          ...mainClaimState,
          convinced: parseInt(mainClaimState.convinced),
          notYetPersuaded: parseInt(mainClaimState.notYetPersuaded),
        };
      }
      return mainClaimState;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getGameReasonsToPlayIds(roomCode: string) {
    try {
      return await this.db.smembers(`${roomCode}:${this.reasons}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getGameReasonsToPlay(roomCode: string, reasonsToPlayIds: Array<string>) {
    try {
      const reasonsToPlay = [];
      for (const reasonId of reasonsToPlayIds) {
        const reason = await this.db.hgetall(`${roomCode}:${this.reasons}:${reasonId}`);
        reason.discuss = parseInt(reason.discuss);
        reason.ignore = parseInt(reason.ignore);
        reasonsToPlay.push(reason);
      }
      return reasonsToPlay;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async setGameState(roomCode: string, state: string) {
    try {
      await this.db.hset(`${roomCode}`, this.state, this.states[state]);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public incrementConvinced(roomCode: string) {
    try {
      this.db.hincrby(roomCode, this.convinced, this.upVote);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public decrementConvinced(roomCode: string) {
    try {
      this.db.hincrby(roomCode, this.convinced, this.downVote);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public incrementNotYetPersuaded(roomCode: string) {
    try {
      this.db.hincrby(roomCode, this.notYetPersuaded, this.upVote);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public decrementNotYetPersuaded(roomCode: string) {
    try {
      this.db.hincrby(roomCode, this.notYetPersuaded, this.downVote);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async registerVote(roomCode: string, playerName: string, voteType: string) {
    try {
      const gamePhase = await this.db.hget(`${roomCode}`, this.state);
      if (gamePhase === this.states.endpoll) {
        if (voteType == this.convinced) {
          // Handle convinced voting
          const savedVoteType = await this.db.sismember(
            `${roomCode}:${this.states.endpoll}:${this.notYetPersuaded}`,
            playerName,
          );
          if (parseInt(savedVoteType) == 1) {
            this.db.srem(`${roomCode}:${this.states.endpoll}:${this.notYetPersuaded}`, playerName);
            this.decrementNotYetPersuaded(`${roomCode}:${this.states.endpoll}`);
          }
          this.db.sadd(`${roomCode}:${this.states.endpoll}:${this.convinced}`, playerName);
          this.incrementConvinced(`${roomCode}:${this.states.endpoll}`);
        } else {
          // Handle notYetPersuaded voting
          const savedVoteType = await this.db.sismember(
            `${roomCode}:${this.states.endpoll}:${this.convinced}`,
            playerName,
          );
          if (parseInt(savedVoteType) == 1) {
            this.db.srem(`${roomCode}:${this.states.endpoll}:${this.convinced}`, playerName);
            this.decrementConvinced(`${roomCode}:${this.states.endpoll}`);
          }
          this.db.sadd(`${roomCode}:${this.states.endpoll}:${this.notYetPersuaded}`, playerName);
          this.incrementNotYetPersuaded(`${roomCode}:${this.states.endpoll}`);
        }
      } else {
        if (voteType == this.convinced) {
          // Handle convinced voting
          const savedVoteType = await this.db.sismember(`${roomCode}:${this.notYetPersuaded}`, playerName);
          if (parseInt(savedVoteType) == 1) {
            this.db.srem(`${roomCode}:${this.notYetPersuaded}`, playerName);
            this.decrementNotYetPersuaded(roomCode);
          }
          this.db.sadd(`${roomCode}:${this.convinced}`, playerName);
          this.incrementConvinced(roomCode);
        } else {
          // Handle notYetPersuaded voting
          const savedVoteType = await this.db.sismember(`${roomCode}:${this.convinced}`, playerName);
          if (parseInt(savedVoteType) == 1) {
            this.db.srem(`${roomCode}:${this.convinced}`, playerName);
            this.decrementConvinced(roomCode);
          }
          this.db.sadd(`${roomCode}:${this.notYetPersuaded}`, playerName);
          this.incrementNotYetPersuaded(roomCode);
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public addReasonToPlay(roomCode: string, playerName: string, reasonToPlay: string) {
    try {
      const reasonId: string = this.hashReasonCode(reasonToPlay);
      playerName = playerName ? playerName : 'referee';
      this.db.sadd(`${roomCode}:${this.reasons}`, reasonId);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this._id, reasonId);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.playerName, playerName);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.reason, reasonToPlay);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.discuss, this.initVoteCount);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.ignore, this.initVoteCount);
      const reasonObject = {
        _id: reasonId,
        reason: reasonToPlay,
        playerName: playerName,
        discuss: this.initVoteCount,
        ignore: this.initVoteCount,
      };
      return reasonObject;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async editReasonToPlay(roomCode: string, reasonId: string, reasonText: string) {
    try {
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.reason, reasonText);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.discuss, this.initVoteCount);
      this.db.hset(`${roomCode}:${this.reasons}:${reasonId}`, this.ignore, this.initVoteCount);
      const reasonObject = {
        _id: reasonId,
        reason: reasonText,
        playerName: await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.playerName),
        discuss: this.initVoteCount,
        ignore: this.initVoteCount,
      };
      return reasonObject;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async incrementDiscussReasonVote(roomCode: string, reasonId: string) {
    try {
      const doesReasonExist = await this.db.hexists(`${roomCode}:${this.reasons}:${reasonId}`, this._id);
      if (parseInt(doesReasonExist) == 1) {
        this.db.hincrby(`${roomCode}:${this.reasons}:${reasonId}`, this.discuss, this.upVote);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async decrementDiscussReasonVote(roomCode: string, reasonId: string) {
    try {
      const doesReasonExist = await this.db.hexists(`${roomCode}:${this.reasons}:${reasonId}`, this._id);
      if (parseInt(doesReasonExist) == 1) {
        const discussVoteCount = await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.discuss);
        if (parseInt(discussVoteCount) > 0) {
          this.db.hincrby(`${roomCode}:${this.reasons}:${reasonId}`, this.discuss, this.downVote);
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async incrementIgnoreReasonVote(roomCode: string, reasonId: string) {
    try {
      const doesReasonExist = await this.db.hexists(`${roomCode}:${this.reasons}:${reasonId}`, this._id);
      if (parseInt(doesReasonExist) == 1) {
        this.db.hincrby(`${roomCode}:${this.reasons}:${reasonId}`, this.ignore, this.upVote);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async decrementIgnoreReasonVote(roomCode: string, reasonId: string) {
    try {
      const doesReasonExist = await this.db.hexists(`${roomCode}:${this.reasons}:${reasonId}`, this._id);
      if (parseInt(doesReasonExist) == 1) {
        const ignoreVoteCount = await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.ignore);
        if (parseInt(ignoreVoteCount) > 0) {
          this.db.hincrby(`${roomCode}:${this.reasons}:${reasonId}`, this.ignore, this.downVote);
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getReasonToPlay(roomCode: string, reasonId: string) {
    try {
      let reasonToPlay = await this.db.hgetall(`${roomCode}:${this.reasons}:${reasonId}`);
      reasonToPlay = {
        ...reasonToPlay,
        discuss: parseInt(reasonToPlay.discuss),
        ignore: parseInt(reasonToPlay.ignore),
      };
      return reasonToPlay;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async beginBoutOfLogicalSkirmish(roomCode: string, reasonId: string) {
    try {
      const reasonToSkirmish = {
        _id: await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this._id),
        playerName: await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.playerName),
        reason: await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.reason),
        discuss: parseInt(await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.discuss)),
        ignore: parseInt(await this.db.hget(`${roomCode}:${this.reasons}:${reasonId}`, this.ignore)),
        established: this.initVoteCount,
        contestested: this.initVoteCount,
      };
      this.db.hset(`${roomCode}:${this.skirmish}`, this._id, reasonToSkirmish._id);
      this.db.hset(`${roomCode}:${this.skirmish}`, this.playerName, reasonToSkirmish.playerName);
      this.db.hset(`${roomCode}:${this.skirmish}`, this.reason, reasonToSkirmish.reason);
      this.db.hset(`${roomCode}:${this.skirmish}`, this.discuss, reasonToSkirmish.discuss);
      this.db.hset(`${roomCode}:${this.skirmish}`, this.ignore, reasonToSkirmish.ignore);
      this.db.hset(`${roomCode}:${this.skirmish}`, this.established, this.initVoteCount);
      this.db.hset(`${roomCode}:${this.skirmish}`, this.contested, this.initVoteCount);
      // Delete the reason from the set and hash set
      this.db.srem(`${roomCode}:${this.reasons}`, reasonId);
      this.db.del(`${roomCode}:${this.reasons}:${reasonId}`);
      return reasonToSkirmish;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async editBoutOfLogicalSkirmish(roomCode: string, reason: string) {
    try {
      this.db.hset(`${roomCode}:${this.skirmish}`, this.reason, reason);
      const reasonInPlay = {
        _id: await this.db.hget(`${roomCode}:${this.skirmish}`, this._id),
        playerName: await this.db.hget(`${roomCode}:${this.skirmish}`, this.playerName),
        reason: reason,
        discuss: parseInt(await this.db.hget(`${roomCode}:${this.skirmish}`, this.discuss)),
        ignore: parseInt(await this.db.hget(`${roomCode}:${this.skirmish}`, this.ignore)),
        established: parseInt(await this.db.hget(`${roomCode}:${this.skirmish}`, this.established)),
        contested: parseInt(await this.db.hget(`${roomCode}:${this.skirmish}`, this.contested)),
      };
      return reasonInPlay;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getReasonInPlay(roomCode: string) {
    try {
      const reasonInPlayExist = await this.db.exists(`${roomCode}:${this.skirmish}`);
      let reasonInPlay = null;
      if (parseInt(reasonInPlayExist) === 1) {
        reasonInPlay = await this.db.hgetall(`${roomCode}:${this.skirmish}`);
        reasonInPlay = {
          ...reasonInPlay,
          discuss: parseInt(reasonInPlay.discuss),
          ignore: parseInt(reasonInPlay.ignore),
          established: parseInt(reasonInPlay.established),
          contested: parseInt(reasonInPlay.contested),
        };
      }
      return reasonInPlay;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public incrementEstablishedReasonInPlayVote(roomCode: string) {
    try {
      this.db.hincrby(`${roomCode}:${this.skirmish}`, this.established, this.upVote);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async decrementEstablishedReasonInPlayVote(roomCode: string) {
    try {
      const establishedVoteCount = await this.db.hget(`${roomCode}:${this.skirmish}`, this.established);
      if (parseInt(establishedVoteCount) > 0) {
        this.db.hincrby(`${roomCode}:${this.skirmish}`, this.established, this.downVote);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public incrementContestedReasonInPlayVote(roomCode: string) {
    try {
      this.db.hincrby(`${roomCode}:${this.skirmish}`, this.contested, this.upVote);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async decrementContestedReasonInPlayVote(roomCode: string) {
    try {
      const contestedVoteCount = await this.db.hget(`${roomCode}:${this.skirmish}`, this.contested);
      if (parseInt(contestedVoteCount) > 0) {
        this.db.hincrby(`${roomCode}:${this.skirmish}`, this.contested, this.downVote);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async moveToEstablishedGrounds(roomCode) {
    try {
      let reasonInPlay = await this.db.hgetall(`${roomCode}:${this.skirmish}`);
      reasonInPlay = {
        ...reasonInPlay,
        discuss: parseInt(reasonInPlay.discuss),
        ignore: parseInt(reasonInPlay.ignore),
        established: parseInt(reasonInPlay.established),
        contested: parseInt(reasonInPlay.contested),
      };
      this.db.sadd(`${roomCode}:${this.establishedGrounds}`, reasonInPlay._id);
      this.db.hset(`${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`, this._id, reasonInPlay._id);
      this.db.hset(
        `${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`,
        this.playerName,
        reasonInPlay.playerName,
      );
      this.db.hset(`${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`, this.reason, reasonInPlay.reason);
      this.db.hset(`${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`, this.discuss, reasonInPlay.discuss);
      this.db.hset(`${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`, this.ignore, reasonInPlay.ignore);
      this.db.hset(
        `${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`,
        this.established,
        reasonInPlay.established,
      );
      this.db.hset(
        `${roomCode}:${this.establishedGrounds}:${reasonInPlay._id}`,
        this.contested,
        reasonInPlay.contested,
      );
      this.db.del(`${roomCode}:${this.skirmish}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getEstablishedGrounds(roomCode) {
    try {
      const establishedGrounds = [];
      const doEstablishedGroundsExist = await this.db.exists(`${roomCode}:${this.establishedGrounds}`);
      if (parseInt(doEstablishedGroundsExist) === 1) {
        const establishedGroundsIds = await this.db.smembers(`${roomCode}:${this.establishedGrounds}`);
        for (const groundsId of establishedGroundsIds) {
          let establishedGround = await this.db.hgetall(`${roomCode}:${this.establishedGrounds}:${groundsId}`);
          establishedGround = {
            ...establishedGround,
            discuss: parseInt(establishedGround.discuss),
            ignore: parseInt(establishedGround.ignore),
            established: parseInt(establishedGround.established),
            contested: parseInt(establishedGround.contested),
          };
          establishedGrounds.push(establishedGround);
        }
      }
      return establishedGrounds;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async startEndPoll(roomCode) {
    try {
      await this.setGameState(roomCode, this.states.endpoll);
      let game = await this.db.hgetall(`${roomCode}`);
      game = {
        ...game,
        convinced: this.initVoteCount,
        notYetPersuaded: this.initVoteCount,
      };
      this.db.hset(`${roomCode}:${this.states.endpoll}`, this.mainClaim, game.mainClaim);
      this.db.hset(`${roomCode}:${this.states.endpoll}`, this.state, game.state);
      this.db.hset(`${roomCode}:${this.states.endpoll}`, this.convinced, game.convinced);
      this.db.hset(`${roomCode}:${this.states.endpoll}`, this.notYetPersuaded, game.notYetPersuaded);
      return game;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getWinners(roomCode: string) {
    try {
      const convincedWinners = [];
      const notYetPersuadedWinners = [];
      const convincedVoters = await this.db.smembers(`${roomCode}:${this.convinced}`);
      const notYetPersuadedVoters = await this.db.smembers(`${roomCode}:${this.notYetPersuaded}`);
      for (const voter of convincedVoters) {
        const isVoterPresent = await this.db.sismember(
          `${roomCode}:${this.states.endpoll}:${this.notYetPersuaded}`,
          voter,
        );
        if (parseInt(isVoterPresent) === 1) {
          notYetPersuadedWinners.push(voter);
        }
      }
      for (const voter of notYetPersuadedVoters) {
        const isVoterPresent = await this.db.sismember(`${roomCode}:${this.states.endpoll}:${this.convinced}`, voter);
        if (parseInt(isVoterPresent) === 1) {
          convincedWinners.push(voter);
        }
      }
      const winners = { convinced: convincedWinners, notYetPersuaded: notYetPersuadedWinners };
      return winners;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
