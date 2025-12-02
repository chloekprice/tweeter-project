
export class User {
    alias: string; // PK
    firstName: string;
    lastName: string;
    passwordHash: string;
    imageUrl: string;

    public constructor(
        alias: string,
        firstName: string,
        lastName: string,
        passwordHash: string,
        imageUrl: string
    ) {
        this.alias = alias;
        this.firstName = firstName;
        this.lastName = lastName;
        this.passwordHash = passwordHash;
        this.imageUrl = imageUrl
    }
}
