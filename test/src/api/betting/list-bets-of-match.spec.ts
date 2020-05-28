describe('GET /betting/v1/matches/{matchId}/bets', () => {
  describe('called as anonymous', () => {
    it.skip('should return unauthorized', () => {

    });
  });

  describe('called as an admin', () => {
    it.skip('should return forbidden', () => {

    });
  });

  describe('called as a player', () => {
    describe('should list bets', () => {
      describe('showing other player\'s bets if', () => {
        it.skip('betting time has expired', () => {

        });

        it.skip('player already placed a bet', () => {

        });
      });

      describe('NOT showing other player\'s bets if', () => {
        it.skip('player can still place a bet', () => {

        });
      });
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any match', () => {

        });
      });
    });
  });
});
