describe('PATCH /match/v1/matches/{matchId}', () => {
  describe('called as a player', () => {
    it.skip('should return unauthorized', () => {

    });
  });

  describe('called as an admin', () => {
    it.skip('should set final score of match', () => {

    });
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

    describe('if current time', () => {
      it.skip('is less than 105 minutes from startTime', () => {

      });
    });
  });
});
