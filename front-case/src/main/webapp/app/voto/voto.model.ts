import { IUser } from 'app/entities/user/user.model';
import { IEmpreendimento } from 'app/entities/empreendimento/empreendimento.model';

export interface IVoto {
  id?: number;
  user?: IUser | null;
  empreendimento?: IEmpreendimento | null;
}

export class Voto implements IVoto {
  constructor(public id?: number, public user?: IUser | null, public empreendimento?: IEmpreendimento | null) {}
}

export function getVotoIdentifier(voto: IVoto): number | undefined {
  return voto.id;
}
