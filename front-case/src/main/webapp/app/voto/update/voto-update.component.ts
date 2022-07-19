import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVoto, Voto } from '../voto.model';
import { VotoService } from '../service/voto.service';
import { IUser, User } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEmpreendimento } from 'app/entities/empreendimento/empreendimento.model';
import { EmpreendimentoService } from 'app/entities/empreendimento/service/empreendimento.service';
import { UserManagementService } from 'app/admin/user-management/service/user-management.service'
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, Alert } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-voto-update',
  templateUrl: './voto-update.component.html',
})
export class VotoUpdateComponent implements OnInit {
  isSaving = false;
  usersSharedCollection: IUser[] = [];
  empreendimentosSharedCollection: IEmpreendimento[] = [];
  empreendimentoSelected!: IEmpreendimento;
  account!: Account;
  currentUser!: IUser;
  alerts: Alert[] = [];

  voteForm = this.fb.group({
    id: [undefined],
    user: [],
    empreendimento: [],
  });

  settingsForm = this.fb.group({
    id: [undefined, [Validators.required]],
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    login: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]]
  });

  constructor(
    protected votoService: VotoService,
    protected userService: UserService,
    protected userManagementService: UserManagementService,
    protected empreendimentoService: EmpreendimentoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected accountService: AccountService,
    protected modalService: NgbModal,
    protected alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.alerts = this.alertService.get();

    this.activatedRoute.data.subscribe(({ voto }) => {
      this.updateForm(voto);

      this.loadRelationshipsOptions();
    });

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          id: account.id,
          login: account.login
        });
      }
    });

    this.currentUser = new User(this.settingsForm.get(['id'])!.value, this.settingsForm.get(['login'])!.value)
  }

  reloadState(): void {
    window.location.reload();
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

  selectedEmpreendimento(empreendimento: IEmpreendimento): void{
    this.empreendimentoSelected = empreendimento;
  }




  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    setTimeout(() => this.reloadState(), 5000);

    this.alertService.addAlert(
      {
          type: 'success',
          message: 'Seu voto foi contabilizado com sucesso!',
          timeout: 5000,
          toast: false
      });

  }

  protected onSaveError(): void {
    this.alertService.addAlert(
      {
          type: 'warning',
          message: 'Não é possível votar novamente!',
          timeout: 5000,
          toast: false
      }
    );
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(voto: IVoto): void {
    this.voteForm.patchValue({
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
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.voteForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.empreendimentoService
      .query()
      .pipe(map((res: HttpResponse<IEmpreendimento[]>) => res.body ?? []))
      .pipe(
        map((empreendimentos: IEmpreendimento[]) =>
          this.empreendimentoService.addEmpreendimentoToCollectionIfMissing(empreendimentos, this.voteForm.get('empreendimento')!.value)
        )
      )
      .subscribe((empreendimentos: IEmpreendimento[]) => (this.empreendimentosSharedCollection = empreendimentos));
  }

  protected createFromForm(): IVoto {
    return {
      ...new Voto(),
      id: this.voteForm.get(['id'])!.value,
      user: this.currentUser,
      empreendimento: this.empreendimentoSelected,
    };
  }

}
