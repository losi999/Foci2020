describe('GET /betting/v1/tournaments/{tournamentId}/compare/{userId}', () => {
  describe('called as an admin', () => {
    it.skip('should return unauthorized', () => {

    });
  });

  describe('called as a player', () => {
    describe('should get the comparison', () => {
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
      describe('if tournamentId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any tournament', () => {

        });
      });

      describe('if userId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any user', () => {

        });
      });
    });
  });
});
