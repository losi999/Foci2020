import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompareResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-compare-home',
  templateUrl: './compare-home.component.html',
  styleUrls: ['./compare-home.component.scss'],
})
export class CompareHomeComponent implements OnInit {
  comparison: CompareResponse;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.comparison = this.activatedRoute.snapshot.data.comparison;
    console.log(this.comparison);
  }

}
