import { Converter } from '@/types/types';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';

const converter: Converter<TournamentDocument, TournamentResponse> = ({ tournamentId, tournamentName }) => {
  return {
    tournamentId,
    tournamentName,
  };
};
export default converter;
