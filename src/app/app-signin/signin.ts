import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserHandler, Users, _Users } from '../app-services/userInfo';


@Component({
  selector: 'login',
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss'],
  providers: [UserHandler]
})
export class SignInComponent {
  /*
  
  Input boxes currently on the page
  email: the 'Email' input
  pass: the 'Password' input

  All possible input attributes are valid properties
  'Placeholder' is an alias for 'label' (placeholders
    are ignored and replaced with label tags)

  */
  attr: any = {
    email: {
      for: 'email',
      type: 'text',
      placeholder: 'Email',
      value: ''
    },
    pass: {
      for: 'pass',
      type: 'password',
      label: 'Password',
      value: ''
    },
  }
  inStyles = {
    wrong: false
  }
  /*
  
  Buttons currently on the page
  sI_btn: the 'Sign In' button
  d_btn: the 'John Doe' button

  'text' is the text displayed on the button
  'config' allows you to activate/deactivate classes
  */
  btns: any = {
    sI_btn: {
      text: 'Sign In',
      config: {}
    },
    d_btn: {
      text: 'John Doe',
      config: {
        active: true
      }
    }
  }
  //Messages that can be displayed
  messages = {
    checkExist: 'The email and/or password provided is not recognized. Check your information and try again.',
    incorrect: 'Incorrect username or password.',
    already: 'This user is already signed in.'
  }
  //Message currently being displayed
  message = {
    config: {
      active: false
    },
    text: this.messages.incorrect
  }

  constructor(
    private router: Router,
    private userHandler: UserHandler,
    public localUsers: Users) { }

  signIn() {
    if (this.btns.sI_btn.config.active) {
      const email: string = this.attr.email.value,
        pass: string = this.attr.pass.value,

        user = this.userHandler.signIn(email, pass)
      if (user !== false) {
        const { info, token } = user
        let initStore: any = localStorage.getItem('users'),
          store: number[] = [],
          curr = {token: token, info: info}
        if (localStorage.getItem('users')) {
          store = JSON.parse(initStore)
        }

        store.push(user.token)
        localStorage.setItem('users', JSON.stringify(store))
        localStorage.setItem('current', JSON.stringify(curr))
        this.localUsers.all.push(info)
        this.localUsers.currentInd = this.localUsers.all.length - 1;

        this.router.navigate(['/home'])
        return true
      }
      this.inStyles.wrong = true
      this.message.config.active = true
      return false
    }
    return false
  }


  //'John Doe' button behavior
  //Fills in default values for login info
  fillInputs() {
    this.attr.email.value = 'john@test.com'
    this.attr.pass.value = 'test'
  }
  //Hand input events
  //'e' = input event
  //'i' = input responsible for event
  inputHandle(e: any, i: string) {
    this.attr[i].value = e.value

    //Store input values in 'attr' for later use
    if (this.attr.email.value && this.attr.pass.value) {
      this.btns.sI_btn.config.active = true
    } else {
      this.btns.sI_btn.config.active = false
    }
  }
  //Handle 'Hover' events
  mouseOver(btn: string) {
    this.btns[btn].config.hover = true
  }
  mouseOut(btn: string) {
    this.btns[btn].config.hover = false
  }
}
