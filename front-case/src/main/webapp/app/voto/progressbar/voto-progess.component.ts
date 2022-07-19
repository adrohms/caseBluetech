import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VotoService } from '../service/voto.service';
import { EmpreendimentoService } from 'app/entities/empreendimento/service/empreendimento.service';
import { IEmpreendimento } from 'app/entities/empreendimento/empreendimento.model';
import { IVoto } from '../voto.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-voto-progess',
  templateUrl: './voto-progess.component.html'
})
export class VotoProgessComponent implements OnInit{

  @Input()
  selectedEmpreendimento!: IEmpreendimento;

  empreendimentos?: IEmpreendimento[];
  isLoading = false;
  votos?: IVoto[] = [];
  totalVotos = 0;
  totalVotosRecebidoEmpreendimento = 0;
  percentSize = 0;

  constructor(protected votoService: VotoService,
              protected modalService: NgbModal,
              protected empreendimentoService: EmpreendimentoService)
              {}


  loadAllVotes(): void {
    this.isLoading = true;

    this.votoService.query().subscribe({
      next: (res: HttpResponse<IVoto[]>) => {
        this.isLoading = false;
        this.votos = res.body ?? [];
        this.totalVotos = this.votos.length;
        this.totalVotosRecebidoEmpreendimento = this.votos.filter( voto => voto.empreendimento?.id === this.selectedEmpreendimento.id).length;
        if(this.totalVotosRecebidoEmpreendimento === 0 || this.totalVotos === 0) {
          this.percentSize = 0;
        } else {
          this.percentSize = (this.totalVotosRecebidoEmpreendimento/this.totalVotos)*100;
        }

      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
      this.loadAllVotes();
  }
}
