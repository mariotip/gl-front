import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = ENV.API_URL
  userList: any = []

  constructor(private http: HttpClient) { }

  login = (data: any) => this.http.post(`${this.apiUrl}/login`, data)
  users = () => this.http.get(`${this.apiUrl}/user`)
  save = (data: any) => this.http.post(`${this.apiUrl}/register`, data)
  show = (param: number) => this.http.get(`${this.apiUrl}/user/${param}`)
  update = (param: number, data: any) => this.http.put(`${this.apiUrl}/user/${param}`, data)
  delete = (param: number) => this.http.delete(`${this.apiUrl}/user/${param}`)
}

