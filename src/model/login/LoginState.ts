import {doop} from 'doop';
import {LoginStatus} from '../LoginStatus';
import {AxiosRequestConfig} from 'axios';

@doop
export class LoginState {

    @doop
    public get loginStatus() {
        return doop<LoginStatus, this>();
    };

    @doop
    public get loginName() {
        return doop<string, this>();
    };

    @doop
    public get loginPass() {
        return doop<string, this>();
    };

    private constructor(loginStatus: LoginStatus,
                        loginName: string,
                        loginPass: string,
    ) {
        return this.loginStatus(loginStatus).loginName(loginName).loginPass(loginPass)
    }

    public static createDefault() {
        return new LoginState(LoginStatus.INITIALS, '', '', );
    }

    public loginAuthConfig(): AxiosRequestConfig {
        return {
            auth: {
                username: this.loginName(),
                password: this.loginPass()
            },
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        };
    }
}
