import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVoto, Voto } from '../voto.model';
import { VotoService } from '../service/voto.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEmpreendimento } from 'app/entities/empreendimento/empreendimento.model';
import { EmpreendimentoService } from 'app/entities/empreendimento/service/empreendimento.service';

@Component({
  selector: 'jhi-voto-update',
  templateUrl: './voto-update.component.html',
})
export class VotoUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  empreendimentosSharedCollection: IEmpreendimento[] = [];

  editForm = this.fb.group({
    id: [],
    user: [],
    empreendimento: [],
  });

  constructor(
    protected votoService: VotoService,
    protected userService: UserService,
    protected empreendimentoService: EmpreendimentoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voto }) => {
      this.updateForm(voto);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voto = this.createFromForm();
    if (voto.id !== undefined) {
      this.subscribeToSaveResponse(this.votoService.update(voto));
    } else {
      this.subscribeToSaveResponse(this.votoService.create(voto));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  trackEmpreendimentoById(_index: number, item: IEmpreendimento): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoto>>): void {
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

  protected updateForm(voto: IVoto): void {
    this.editForm.patchValue({
      id: voto.id,
      user: voto.user,
      empreendimento: voto.empreendimento,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, voto.user);
    this.empreendimentosSharedCollection = this.empreendimentoService.addEmpreendimentoToCollectionIfMissing(
      this.empreendimentosSharedCollection,
      voto.empreendimento
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.empreendimentoService
      .query()
      .pipe(map((res: HttpResponse<IEmpreendimento[]>) => res.body ?? []))
      .pipe(
        map((empreendimentos: IEmpreendimento[]) =>
          this.empreendimentoService.addEmpreendimentoToCollectionIfMissing(empreendimentos, this.editForm.get('empreendimento')!.value)
        )
      )
      .subscribe((empreendimentos: IEmpreendimento[]) => (this.empreendimentosSharedCollection = empreendimentos));
  }

  protected createFromForm(): IVoto {
    return {
      ...new Voto(),
      id: this.editForm.get(['id'])!.value,
      user: this.editForm.get(['user'])!.value,
      empreendimento: this.editForm.get(['empreendimento'])!.value,
    };
  }
}