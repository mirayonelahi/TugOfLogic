import SocketActions from './socketActions';

export default ({ io }) => {
  io.on('connection', function (socket) {
    const actions = new SocketActions(socket, io);
    socket.on('initGame', actions.initGame.bind(actions));
    socket.on('joinRoom', actions.joinRoom.bind(actions));
    socket.on('voteOnMainClaim', actions.voteOnMainClaim.bind(actions));
    socket.on('addReasonToPlay', actions.addReasonToPlay.bind(actions));
    socket.on('upVoteDiscussReasonToPlay', actions.upVoteDiscussReasonToPlay.bind(actions));
    socket.on('downVoteDiscussReasonToPlay', actions.downVoteDiscussReasonToPlay.bind(actions));
    socket.on('upVoteIgnoreReasonToPlay', actions.upVoteIgnoreReasonToPlay.bind(actions));
    socket.on('downVoteIgnoreReasonToPlay', actions.downVoteIgnoreReasonToPlay.bind(actions));
    socket.on('beginBout', actions.beginBoutOfLogicalSkirmish.bind(actions));
    socket.on('updateReasonToPlay', actions.editReasonToPlay.bind(actions));
    socket.on('updateReasonInPlay', actions.editBoutOfLogicalSkirmish.bind(actions));
    socket.on('upVoteEstablishedReasonInPlay', actions.upVoteEstablishedReasonInPlay.bind(actions));
    socket.on('downVoteEstablishedReasonInPlay', actions.downVoteEstablishedReasonInPlay.bind(actions));
    socket.on('upVoteContestedReasonInPlay', actions.upVoteContestedReasonInPlay.bind(actions));
    socket.on('downVoteContestedReasonInPlay', actions.downVoteContestedReasonInPlay.bind(actions));
    socket.on('moveRIPToEstablishedGrounds', actions.moveToEstablishedGrounds.bind(actions));
    socket.on('startEndPoll', actions.startEndPoll.bind(actions));
    socket.on('getWinners', actions.getWinners.bind(actions));
  });
};
