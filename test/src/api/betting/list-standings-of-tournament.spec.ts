describe('GET /betting/v1/tournaments/{tournamentId}/standings', () => {
  describe('called as anonymous', () => {
    it.skip('should return unauthorized', () => {

    });
  });

  describe('called as an admin', () => {
    it.skip('should return forbidden', () => {

    });
  });

  describe('called as a player', () => {
    it.skip('should get the standings', () => {

    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any tournament', () => {

        });
      });
    });
  });
});
