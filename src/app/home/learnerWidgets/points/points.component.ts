import { Component, OnInit } from '@angular/core';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  users: any = [];
  loading = true;
  isEmpty = false;
  constructor(private service: GlobalApiService) {}

  ngOnInit() {
    this.getPoints();
  }

  getPoints() {
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));
    this.service.get_leaderboard_points(data).subscribe(
      (res) => {
        this.users = res.Data.userpoints;
        this.isEmpty = res.Data.empty;
        this.loading = false;
        res.Data.forEach((element: any) => {
          console.log(JSON.stringify(element));
        });
      },
      (err) => {
        console.log(err);
      }
    );
    return null;
  }
}
