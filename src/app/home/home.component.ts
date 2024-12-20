import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(protected http: HttpClient) {

  }

  async clickHandler() {
    //// Promise option

    // const response = await fetch(environment.API_URL + "/home/test", {
    //   method: "GET",
    //   headers: {
    //     'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const data = await response.json();
    // console.log(data);

    //// Oservable option

    // const o = new Observable<string>(function Conveer(subscriber) {
    //   fetch(environment.API_URL + "/home/test", {
    //     method: "GET",
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       for (let i = 0; i < data.users.length; i++) {
    //         subscriber.next(data.users[i].name)
    //       }
    //     });
    // });

    // const usersNames = []

    // o.subscribe(function next(username: string) {
    //     usersNames.push(username)
    // })

    this.http.get<string>(environment.API_URL + "/home/test")
    .subscribe(data => console.log(data));
  }

}
