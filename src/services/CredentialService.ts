import bcrypt from 'bcrypt';

export class CredentialService {

    // To compare Password
    async comparePassword(password: string, hashPassword: string) {
        return bcrypt.compare(password, hashPassword);
    }


}