import { Buffer } from "buffer";
import AuthenticationPresenter, { AuthenticationView } from "./AuthenticationPresenter";

class RegisterPresenter extends AuthenticationPresenter {
    private _firstName: string = "";
    private _lastName: string = "";
    private _alias: string = "";
    private _password: string = "";
    private _imageBytes: Uint8Array = new Uint8Array()
    private _imageUrl: string = "";
    private _imageFileExtension: string = "";
    private _rememberMe: boolean = false;

    public constructor(view: AuthenticationView) {
        super(view);
    }

    public get firstName(): string { return this._firstName; }
    public get lastName(): string { return this._lastName; }
    public get alias(): string { return this._alias; }
    public get password(): string { return this._password; }
    public get imageBytes(): Uint8Array { return this._imageBytes; }
    public get imageUrl(): string { return this._imageUrl; }
    public get imageFileExtension(): string { return this._imageFileExtension; }
    public get rememberMe(): boolean { return this._rememberMe; }

    public setFirstName(newValue: string) { this._firstName = newValue; }
    public setLastName(newValue: string) { this._lastName = newValue }
    public setAlias(newValue: string) { this._alias = newValue; }
    public setPassword(newValue: string) { this._password = newValue }
    public set imageBytes(newValue) { this._imageBytes = newValue; }
    public set imageUrl(newValue) { this._imageUrl = newValue; }
    public set imageFileExtension(newValue) { this._imageFileExtension = newValue; }
    public setRememberMe(newValue: boolean) { this._rememberMe = newValue; }
    

    public checkSubmitButtonStatus(): boolean {
        return (
            !this.firstName ||
            !this.lastName ||
            !this.alias ||
            !this.password ||
            !this.imageUrl ||
            !this.imageFileExtension
        );
    };

    public async doRegister() {
        try {
            this.isLoading = true;
            const [user, authToken] = await this.authService.register(
                this.firstName,
                this.lastName,
                this.alias,
                this.password,
                this.imageBytes,
                this.imageFileExtension
            );
            this.view.update(user, user, authToken, this.rememberMe);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to register user because of exception: ${error}`);
        } finally {
            this.isLoading = false;
        }
    }

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    };

    public handleImageFile(file: File | undefined) {
        if (file) {
          this.imageUrl = URL.createObjectURL(file);
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this.imageBytes = bytes;
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.imageFileExtension = fileExtension;
          }
        } else {
            this.imageUrl = "";
            this.imageBytes = new Uint8Array();
        }
    }
}

export default RegisterPresenter;
