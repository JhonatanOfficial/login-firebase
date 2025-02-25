export class FormValidateService {
    
    static confirmPassword(passowrd: string, confirmPassword: string): boolean {
        return Boolean(passowrd === confirmPassword)
    } 
}