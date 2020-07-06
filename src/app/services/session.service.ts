import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  setItem(key, value) {
    if(typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  }

  getItem(key) {
    if(typeof localStorage !== 'undefined'){
      return localStorage.getItem(key);
    }
    else{
      return '';
    }
  }

  setObject(key, object) {
    if(typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(object));
  }

  getObject(key) {
    if(typeof localStorage !== 'undefined'){
      return JSON.parse(localStorage.getItem(key));  
    }
    else{
      return '';
    }
  }

  destroy(key) {
    if(typeof localStorage !== 'undefined') localStorage.removeItem(key);
  }

  allCLear(){
    localStorage.clear();
  }
}