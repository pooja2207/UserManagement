import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
 static validationMessages:any = {
  email: [
    { type: 'required', message: 'Email field is required' },
    { type: 'emailValidator', message: 'Enter a valid email' },
],
name:[
  { type: 'required', message: 'This field is required' },
]
 }


 static emailValidator(value): any {

  if (value.pristine) {
      return null;
  }

  if (value.value.length === 0) {
      return;
  }


  const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  value.markAsTouched();

  if (EMAIL_REGEXP.test(value.value)) {
      return null;
  }

  return {
      emailValidator: true
  };
}
  constructor() { }
}
