import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../app-services/mainService';
import { UserHandler, Users, _Users } from '../app-services/userInfo';

@Component({
  selector: 'login',
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss'],
  providers: [UserHandler],
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
      value: '',
    },
    pass: {
      for: 'pass',
      type: 'password',
      label: 'Password',
      value: '',
    },
  };
  inStyles = {
    wrong: false,
  };
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
      config: {},
    },
    d_btn: {
      text: 'John Doe',
      config: {
        active: true,
      },
    },
  };
  //Messages that can be displayed
  messages = {
    checkExist:
      'The email and/or password provided is not recognized. Check your information and try again.',
    incorrect: 'Incorrect username or password.',
    already: 'This user is already signed in.',
  };
  //Message currently being displayed
  message = {
    config: {
      active: false,
    },
    text: this.messages.incorrect,
  };

  constructor(
    private router: Router,
    private userHandler: UserHandler,
    public localUsers: Users,
    private main: MainService
  ) {
    const val = {
      solid: false,
      interval: 5,
      images: [
        'assets/Collage1.jpg',
        'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
        'https://images7.alphacoders.com/290/290702.jpg',
        'https://i.pinimg.com/originals/61/f4/71/61f471d0eb41616e76533923d76de432.jpg',
        'https://live.staticflickr.com/1904/45226537512_ac046b9599_b.jpg',
        'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_899,q_75,w_1200/v1/clients/lakenorman/Taylor_Christian_2e2d907b-abe8-42f0-9d93-7d55eb16349f.jpg',
        'http://wallup.net/wp-content/uploads/2016/01/245022-nature-landscape-lake-cave-Chile-colorful-water-erosion-rock-rock_formation.jpg',
      ],
    };
    this.main.background.next({ ...main.background.getValue(), ...val });
    this.main.nav.next({...this.main.nav.getValue(),active: false})
  }

  signIn() {
    if (this.btns.sI_btn.config.active) {
      const email: string = this.attr.email.value,
        pass: string = this.attr.pass.value,
        user = this.userHandler.signIn(email, pass);
      if (user !== false) {
        const { info, token } = user;
        let initStore: any = localStorage.getItem('users'),
          store: number[] = [],
          curr = { token: token, info: info };
        if (localStorage.getItem('users')) {
          store = JSON.parse(initStore);
        }

        store.push(user.token);
        localStorage.setItem('users', JSON.stringify(store));
        localStorage.setItem('current', JSON.stringify(curr));
        this.localUsers.all.push(info);
        this.localUsers.currentInd = this.localUsers.all.length - 1;

        this.router.navigate(['/home']);
        return true;
      }
      this.inStyles.wrong = true;
      this.message.config.active = true;
      return false;
    }
    return false;
  }

  //'John Doe' button behavior
  //Fills in default values for login info
  fillInputs() {
    this.attr.email.value = 'john@test.com';
    this.attr.pass.value = 'test';
  }
  //Hand input events
  //'e' = input event
  //'i' = input responsible for event
  inputHandle(e: any, i: string) {
    this.attr[i].value = e.value;

    //Store input values in 'attr' for later use
    if (this.attr.email.value && this.attr.pass.value) {
      this.btns.sI_btn.config.active = true;
    } else {
      this.btns.sI_btn.config.active = false;
    }
  }
  //Handle 'Hover' events
  mouseOver(btn: string) {
    this.btns[btn].config.hover = true;
  }
  mouseOut(btn: string) {
    this.btns[btn].config.hover = false;
  }
}
