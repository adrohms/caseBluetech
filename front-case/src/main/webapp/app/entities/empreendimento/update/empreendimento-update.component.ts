import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEmpreendimento, Empreendimento } from '../empreendimento.model';
import { EmpreendimentoService } from '../service/empreendimento.service';

@Component({
  selector: 'jhi-empreendimento-update',
  templateUrl: './empreendimento-update.component.html',
})
export class EmpreendimentoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
    endereco: [],
  });

  constructor(
    protected empreendimentoService: EmpreendimentoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empreendimento }) => {
      this.updateForm(empreendimento);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empreendimento = this.createFromForm();
    if (empreendimento.id !== undefined) {
      this.subscribeToSaveResponse(this.empreendimentoService.update(empreendimento));
    } else {
      this.subscribeToSaveResponse(this.empreendimentoService.create(empreendimento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpreendimento>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(empreendimento: IEmpreendimento): void {
    this.editForm.patchValue({
      id: empreendimento.id,
      nome: empreendimento.nome,
      endereco: empreendimento.endereco,
    });
  }

  protected createFromForm(): IEmpreendimento {
    return {
      ...new Empreendimento(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
    };
  }
}
