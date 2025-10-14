import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import AuthenticationService from "../../models/AuthenticationService";
import BasePresenter, { PresenterView } from "../BasePresenter";

export interface RegisterView extends PresenterView {
    setAlias: (alias: string) => void
    setPassword: (password: string) => void
    setRememberMe: (rememberMe: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    setImageUrl: (imageUrl: string) => void
    setImageBytes: (imageBytes: Uint8Array) => void
    setImageFileExtension: (imageFileExtension: string) => void
    update: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void 
}

class RegisterPresenter extends BasePresenter<RegisterView> {
    protected authService: AuthenticationService;

    public constructor(view: RegisterView) {
        super(view);
        this.authService = new AuthenticationService();
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
        await this.performThrowingFunction( async() => {
            this.view.setIsLoading(true);
            const [user, authToken] = await this.authService.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );
            this.view.update(user, user, authToken, rememberMe);
        }, "register user").then(() => { this.view.setIsLoading(false); })
    }

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    };

    public handleImageFile(file: File | undefined) {
        if (file) {
          this.view.setImageUrl(URL.createObjectURL(file));
    
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
    
            this.view.setImageBytes(bytes);
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.view.setImageFileExtension(fileExtension);
          }
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    }
}

export default RegisterPresenter;
