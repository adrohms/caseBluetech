import { IVoto } from 'app/voto/voto.model';

export interface IEmpreendimento {
  id?: number;
  nome?: string | null;
  endereco?: string | null;
  votos?: IVoto[] | null;
}

export class Empreendimento implements IEmpreendimento {
  constructor(public id?: number, public nome?: string | null, public endereco?: string | null, public votos?: IVoto[] | null) {}
}

export function getEmpreendimentoIdentifier(empreendimento: IEmpreendimento): number | undefined {
  return empreendimento.id;
}
