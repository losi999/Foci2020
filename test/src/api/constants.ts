export type User = 'admin1' | 'player1' | 'player2' | 'player3';

export const usernames: { [name in User]: string } = {
  admin1: 'losonczil+admin1@gmail.com',
  player1: 'losonczil+player1@gmail.com',
  player2: 'losonczil+player2@gmail.com',
  player3: 'losonczil+player3@gmail.com'
};
