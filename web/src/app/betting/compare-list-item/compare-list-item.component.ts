import { Component, Input, OnInit } from '@angular/core';
import { CompareResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-compare-list-item',
  templateUrl: './compare-list-item.component.html',
  styleUrls: ['./compare-list-item.component.scss'],
})
export class CompareListItemComponent implements OnInit {
  @Input() match: CompareResponse['matches'][0];
  constructor() { }

  ngOnInit(): void {
  }

}
