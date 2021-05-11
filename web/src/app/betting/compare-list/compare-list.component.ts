import { Component, Input } from '@angular/core';
import { CompareResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-compare-list',
  templateUrl: './compare-list.component.html',
  styleUrls: ['./compare-list.component.scss'],
})
export class CompareListComponent {
  @Input() matches: CompareResponse['matches'];
  constructor() { }
}
