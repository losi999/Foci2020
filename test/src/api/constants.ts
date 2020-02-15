export type User = 'admin' | 'player1' | 'player2' | 'player3';

export const usernames: { [name in User]: string } = {
  admin: 'losonczil+admin@gmail.com',
  player1: 'losonczil+player1@gmail.com',
  player2: 'losonczil+player2@gmail.com',
  player3: 'losonczil+player3@gmail.com'
};
