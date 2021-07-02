import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageProviderService {

  constructor() { }

  showMessage(number) {
    number = parseInt(number);
    switch (number) {
      case 1: {
        var message = "No Record Available.";
        return message;
      }
      case 2: {
        var message = "Mail has not been sent";
        return message;

      }
      case 3: {
        var message = "Invalid parameter";
        return message;
      }
      case 4: {
        var message = "Count mismatch for file and infomation";
        return message;
      }
      case 5: {
        var message = "Count mismatch for file and infomation";
        return message;
      }
      case 6: {
        var message = "Filename not valid";
        return message;

      }
      case 7: {
        var message = "Username not valid";
        return message;

      }
      case 8: {
        var message = "Incorrect password,Try again";
        return message;

      }
      case 9: {
        var message = "User name already present";
        return message;

      }
      case 10: {
        var message = "Group name already present";
        return message;

      }
      case 11: {
        var message = "Category already present";
        return message;
      }
      case 12: {
        var message = "Subcategory already present";
        return message;
      }
      case 13: {
        var message = "Invalid FileSize";
        return message;
      }
      case 15: {
        var message = "Unable to send notification";
        return message;
      }
      case 16: {
        var message = "Permission Denied.";
        return message;
      }

      default:{
        var message = "Something went Wrong.";
        return message;
      }
    }
  }
}

