import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VotoService } from '../service/voto.service';

import { VotoComponent } from './voto.component';

describe('Voto Management Component', () => {
  let comp: VotoComponent;
  let fixture: ComponentFixture<VotoComponent>;
  let service: VotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VotoComponent],
    })
      .overrideTemplate(VotoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VotoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VotoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.votos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
