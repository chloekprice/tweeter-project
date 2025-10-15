import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import AuthenticationPresenter, { AuthenticationView, AuthenticationInfo } from "./AuthenticationPresenter";


export interface RegisterView extends AuthenticationView {
    setImageUrl: (imageUrl: string) => void
    setImageBytes: (imageBytes: Uint8Array) => void
    setImageFileExtension: (imageFileExtension: string) => void
}

export interface RegisterInfo extends AuthenticationInfo {
  firstName: string
  lastName: string
  imageBytes: Uint8Array
  imageFileExtension: string
}


class RegisterPresenter extends AuthenticationPresenter<RegisterView, RegisterInfo> {

    constructor(view: RegisterView) {
        super(view)
    }

    protected async authenticate(authInfo: RegisterInfo): Promise<[User, AuthToken]> {
        return await this.service.register(authInfo.firstName, authInfo.lastName, authInfo.alias, authInfo.password, authInfo.imageBytes, authInfo.imageFileExtension)
    }
    protected getAuthDescription(): string {
        return "register user";
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
