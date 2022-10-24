import { Injectable } from '@angular/core'

@Injectable()
export class xNotifications {
    notices:any = {
        'peter@test.com': {
            general: [{
                msgId: '6g4s6erg54',
                category: 'Welcome',
                title: 'Welcome to Vibe\'n!',
                message:
                    'Welcome to Vibe\'n! We hope are always looking.' +
                    'to grow the family and are here for you no matter what.',
                viewed: false
            }]
        },
        'john@test.com': {
            urgent: [{
                msgId: 'f46s5f4ads',
                category: 'Password Breach',
                title: 'Change your passward',
                message:
                    'The password you just used was found in a data breach.' +
                    'Consider changing your passward.',
                viewed: false
            }],
            general: [{
                msgId: 'd5f4sd6af5',
                category: 'Welcome',
                title: 'Welcome to Vibe\'n!',
                message:
                    'Welcome to Vibe\'n! We hope are always looking.' +
                    'to grow the family and are here for you no matter what.',
                viewed: false
            }]
        }
    }
}