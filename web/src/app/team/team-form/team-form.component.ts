import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { TeamService } from 'src/app/team/team.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class TeamFormComponent implements OnInit {
  form: FormGroup;
  get team (): TeamResponse {
    return this.activatedRoute.snapshot.data.team;
  }

  constructor(private teamService: TeamService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      teamName: new FormControl(this.team?.teamName, [Validators.required]),
      shortName: new FormControl(this.team?.shortName, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
      ]),
      image: new FormControl(this.team?.image, [Validators.required]),
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    const next = () => {
      this.router.navigate(['admin/teams']);
    };

    const error = (error) => {
      console.log(error);
    };

    if(this.form.valid) {
      if(this.team) {
        this.teamService.updateTeam(this.team.teamId, {
          teamName: this.form.value.teamName,
          shortName: this.form.value.shortName,
          image: this.form.value.image,
        }).subscribe({
          next,
          error,
        });
      } else {
        this.teamService.createTeam({
          teamName: this.form.value.teamName,
          shortName: this.form.value.shortName,
          image: this.form.value.image,
        }).subscribe({
          next,
          error,
        });
      }
    }
  }
}
