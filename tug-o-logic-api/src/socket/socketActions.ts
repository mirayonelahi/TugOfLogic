import GameService from '../services/game';
import { Container } from 'typedi';

export default class SocketActions {
  public socket;
  public io;
  private gameService;
  private logger;

  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.gameService = Container.get(GameService);
    this.logger = Container.get('logger');
  }

  public async joinRoom(data) {
    try {
      this.socket.join(data.roomCode);
      const gameState = await this.gameService.getGameState(data.roomCode);
      this.socket.emit('send to room', { roomCode: data.roomCode });
      this.socket.emit('game state', gameState);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public initGame(data) {
    try {
      const roomCode: string = data.roomCode || this.gameService.generateRoomCode();
      const gameData = {
        roomCode: roomCode,
        mainClaim: data.mainClaim,
        state: 'strawpoll',
        established: 0,
        contested: 0,
      };
      const mainClaim = data.mainClaim;
      this.gameService.createNewGame({ roomCode, mainClaim });
      this.socket.join(roomCode);
      this.io.to(roomCode).emit('game created', gameData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async voteOnMainClaim(data) {
    try {
      await this.gameService.registerVote(data.roomCode, data.playerName, data.voteType);
      const mainClaimState = await this.gameService.getGameMainClaim(data.roomCode);
      this.io.to(data.roomCode).emit('main claim vote', mainClaimState);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public addReasonToPlay(data) {
    try {
      const newReasonToPlay = this.gameService.addReasonToPlay(data.roomCode, data.playerName, data.reasonToPlay);
      this.io.to(data.roomCode).emit('add reason', newReasonToPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async editReasonToPlay(data) {
    try {
      const edittedReasonToPlay = await this.gameService.editReasonToPlay(data.roomCode, data.reasonId, data.reason);
      this.io.to(data.roomCode).emit('update rtp', edittedReasonToPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async upVoteDiscussReasonToPlay(data) {
    try {
      await this.gameService.incrementDiscussReasonVote(data.roomCode, data.reasonId);
      const reasonToPlay = await this.gameService.getReasonToPlay(data.roomCode, data.reasonId);
      this.io.to(data.roomCode).emit('update rtp', reasonToPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async downVoteDiscussReasonToPlay(data) {
    try {
      await this.gameService.decrementDiscussReasonVote(data.roomCode, data.reasonId);
      const reasonToPlay = await this.gameService.getReasonToPlay(data.roomCode, data.reasonId);
      this.io.to(data.roomCode).emit('update rtp', reasonToPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async upVoteIgnoreReasonToPlay(data) {
    try {
      await this.gameService.incrementIgnoreReasonVote(data.roomCode, data.reasonId);
      const reasonToPlay = await this.gameService.getReasonToPlay(data.roomCode, data.reasonId);
      this.io.to(data.roomCode).emit('update rtp', reasonToPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async downVoteIgnoreReasonToPlay(data) {
    try {
      await this.gameService.decrementIgnoreReasonVote(data.roomCode, data.reasonId);
      const reasonToPlay = await this.gameService.getReasonToPlay(data.roomCode, data.reasonId);
      this.io.to(data.roomCode).emit('update rtp', reasonToPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async beginBoutOfLogicalSkirmish(data) {
    try {
      const reasonInPlay = await this.gameService.beginBoutOfLogicalSkirmish(data.roomCode, data.reasonId);
      this.io.to(data.roomCode).emit('bout begun', reasonInPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async editBoutOfLogicalSkirmish(data) {
    try {
      const edittedReasonInPlay = await this.gameService.editBoutOfLogicalSkirmish(data.roomCode, data.reason);
      this.io.to(data.roomCode).emit('updated rip', edittedReasonInPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async upVoteEstablishedReasonInPlay(data) {
    try {
      await this.gameService.incrementEstablishedReasonInPlayVote(data.roomCode);
      const reasonInPlay = await this.gameService.getReasonInPlay(data.roomCode);
      this.io.to(data.roomCode).emit('updated rip', reasonInPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async downVoteEstablishedReasonInPlay(data) {
    try {
      await this.gameService.decrementEstablishedReasonInPlayVote(data.roomCode);
      const reasonInPlay = await this.gameService.getReasonInPlay(data.roomCode);
      this.io.to(data.roomCode).emit('updated rip', reasonInPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async upVoteContestedReasonInPlay(data) {
    try {
      await this.gameService.incrementContestedReasonInPlayVote(data.roomCode);
      const reasonInPlay = await this.gameService.getReasonInPlay(data.roomCode);
      this.io.to(data.roomCode).emit('updated rip', reasonInPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async downVoteContestedReasonInPlay(data) {
    try {
      await this.gameService.decrementContestedReasonInPlayVote(data.roomCode);
      const reasonInPlay = await this.gameService.getReasonInPlay(data.roomCode);
      this.io.to(data.roomCode).emit('updated rip', reasonInPlay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async moveToEstablishedGrounds(data) {
    try {
      await this.gameService.moveToEstablishedGrounds(data.roomCode);
      const reasonInPlay = await this.gameService.getReasonInPlay(data.roomCode);
      this.io.to(data.roomCode).emit('updated rip', reasonInPlay);
      const establishedGrounds = await this.gameService.getEstablishedGrounds(data.roomCode);
      this.io.to(data.roomCode).emit('established grounds', establishedGrounds);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async startEndPoll(data) {
    try {
      const endPoll = await this.gameService.startEndPoll(data.roomCode);
      this.io.to(data.roomCode).emit('updated endpoll', endPoll);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getWinners(data) {
    try {
      const results = await this.gameService.getWinners(data.roomCode);
      this.io.to(data.roomCode).emit('give winners', results);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
