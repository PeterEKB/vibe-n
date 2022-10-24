import { Injectable } from "@angular/core";


@Injectable()
export class UserHandler {
    // Mock Users DB
    #_Users: _Users[] = [
        {
            image: 'https://cdn-icons-png.flaticon.com/512/2579/2579246.png',
            fName: 'John',
            lName: 'Doe',
            email: 'john@test.com',
            pass: 'test'
        },
        {
            image: 'https://cdn-icons-png.flaticon.com/512/2579/2579243.png',
            fName: 'Jane',
            lName: 'Doe',
            email: 'jane@test.com',
            pass: 'test'
        },
        {
            image: 'https://cdn-icons-png.flaticon.com/512/4235/4235725.png',
            fName: 'Peter',
            lName: 'Blankson',
            email: 'peter@test.com',
            pass: 'test'
        }
    ]
    // Active user sessions
    #_UserSessions: any = {
        1234567: 0
    }
    // Mock unique session value (Should be replaced with
    // a more secure token)
    #_SessionToken = 1958125


    verifyToken(token: number | string) {
        const userID = this.#_UserSessions[token]
        if ([undefined, null].includes(userID))
            return false

        const newToken = this.#_SessionToken += 7,
            {pass, ...info} = this.#_Users[userID],
            user = {
                info,
                newToken
            }
        return user
    }
    signIn(email: string, pass: string) {
        // Validity check
        const check = this.#_Validity({ email, pass })
        
        if (check.valid !== false) {
            // Return User info and ommit sensitive entriesa
            const token = this.#_SessionToken += 7,
            {pass, ...info} = this.#_Users[check.user],
            user = {
                info,
                token
            }

            // Store token for extended sessions
            this.#_UserSessions[token] = check.user
            return user
        }
        return false
    }
    // Delete a session
    signOut(id: string | number) {
        delete this.#_UserSessions[id]
        if (this.#_UserSessions[id])
            return false
        return true
    }

    // Check whether or not provided email and password
    // matches with stored records
    #_Validity(check: { email: string, pass: string }) {
        let user: number = -1
        this.#_Users.every((v, index) => {
            if (v.email === check.email) {
                if (v.pass === check.pass) {
                    user = index
                    return false
                }
            }
            return true
        })
        return user !== -1 ? { valid: true, user } : { valid: false, user }
    }
}

@Injectable()
export class Users {
    all: _Users[] = []

    currentInd!: number

    get current() {
        let initStore: any = localStorage.getItem('current')
        if (localStorage.getItem('current')) {
            return JSON.parse(initStore)
        }
    }
}


export interface _Users {
    image?: string;
    fName?: string;
    lName?: string;
    email?: string;
    pass?: string;
}