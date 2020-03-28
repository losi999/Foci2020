describe('POST /betting/v1/matches/{matchId}/bets', () => {
  describe('called as an admin', () => {
    it.skip('should return unauthorized', () => {

    });
  });

  describe('called as a player', () => {
    it.skip('should place bet', () => {

    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any match', () => {

        });
      });

      describe('if homeScore', () => {
        it.skip('is missing from body', () => {

        });

        it.skip('is not integer', () => {

        });

        it.skip('is less than 0', () => {

        });
      });

      describe('if awayScore', () => {
        it.skip('is missing from body', () => {

        });

        it.skip('is not integer', () => {

        });

        it.skip('is less than 0', () => {

        });
      });

      it.skip('if player already placed a bet', () => {

      });

      it.skip('if betting time has expired', () => {

      });
    });
  });
});
