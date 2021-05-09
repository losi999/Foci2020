import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { CompareResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { BettingService } from '../betting.service';

@Injectable({
  providedIn: 'root',
})
export class CompareResolver implements Resolve<CompareResponse> {
  constructor(private bettingService: BettingService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<CompareResponse> {
    const userId = route.paramMap.get('userId');
    return this.bettingService.compare('cc1797bf-6545-407e-982a-42fe2378b434', userId);
  }
}
