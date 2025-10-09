import { AuthToken, User } from "tweeter-shared";
import UserService from "../models/UserService";

export interface UserInfoView {
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    displayInfoMsg: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    setIsFollower: (isFollower: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    setFolloweeCount: (numFollowees: number) => void
    setFollowerCount: (numFollowers: number) => void
    deleteMsg: (_toast: string) => void
}

class UserInfoPresenter {
    private userService: UserService;
    private _view: UserInfoView;

    public constructor(view: UserInfoView) {
        this.userService = new UserService();
        this._view = view;
    }

    public get view(): UserInfoView { return this._view; }

    // public intializeUserInfo(authToken: AuthToken, currentUser: User, displayedUser: User) {
    //     this.setIsFollowerStatus(authToken, currentUser, displayedUser);
    //     this.setNumbFollowees(authToken!, displayedUser!);
    //     this.setNumbFollowers(authToken!, displayedUser!);
    // }

    // public async setIsFollowerStatus (authToken: AuthToken, currentUser: User, displayedUser: User)  {
    //     try {
    //       if (currentUser === displayedUser) {
    //         this.view.setIsFollower(false);
    //       } else {
    //         this.view.setIsFollower(await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
    //       }
    //     } catch (error) {
    //       this.view.displayErrorMsg(
    //         `Failed to determine follower status because of exception: ${error}`,
    //       );
    //     }
    //   };
    
    
    //   public async setNumbFollowees(
    //     authToken: AuthToken,
    //     displayedUser: User
    //   ) {
    //     try {
    //       this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    //     } catch (error) {
    //       this.view.displayErrorMsg(
    //         `Failed to get followees count because of exception: ${error}`,
    //       );
    //     }
    //   };
    
    
    //   public async setNumbFollowers (
    //     authToken: AuthToken,
    //     displayedUser: User
    //   )  {
    //     try {
    //       this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    //     } catch (error) {
    //       this.view.displayErrorMsg(
    //         `Failed to get followers count because of exception: ${error}`,
    //       );
    //     }
    //   };
    
    
    //   public getBaseUrl (): string {
    //     const segments = location.pathname.split("/@");
    //     return segments.length > 1 ? segments[0] : "/";
    //   };

    
    //   public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void>  {
    //     var followingUserToast = "";
    
    //     try {
    //       this.view.setIsLoading(true);
    //       followingUserToast = this.view.displayInfoMsg(
    //         `Following ${displayedUser.name}...`,
    //         0
    //       );
    
    //       const [followerCount, followeeCount] = await this.userService.follow(
    //         authToken,
    //         displayedUser
    //       );
    
    //       this.view.setIsFollower(true);
    //       this.view.setFollowerCount(followerCount);
    //       this.view.setFolloweeCount(followeeCount);
    //     } catch (error) {
    //       this.view.displayErrorMsg(
    //         `Failed to follow user because of exception: ${error}`,
    //       );
    //     } finally {
    //       this.view.deleteMsg(followingUserToast);
    //       this.view.setIsLoading(false);
    //     }
    //   };
    
      
    
    //   const unfollowDisplayedUser = async (
    //     event: React.MouseEvent
    //   ): Promise<void> => {
    //     event.preventDefault();
    
    //     var unfollowingUserToast = "";
    
    //     try {
    //       setIsLoading(true);
    //       unfollowingUserToast = displayInfoMsg(
    //         `Unfollowing ${userInfo.displayedUser!.name}...`,
    //         0
    //       );
    
    //       const [followerCount, followeeCount] = await unfollow(
    //         userInfo.authToken!,
    //         userInfo.displayedUser!
    //       );
    
    //       setIsFollower(false);
    //       setFollowerCount(followerCount);
    //       setFolloweeCount(followeeCount);
    //     } catch (error) {
    //       displayErrorMsg(
    //         `Failed to unfollow user because of exception: ${error}`,
    //       );
    //     } finally {
    //       deleteMsg(unfollowingUserToast);
    //       setIsLoading(false);
    //     }
    //   };
    
    //   const unfollow = async (
    //     authToken: AuthToken,
    //     userToUnfollow: User
    //   ): Promise<[followerCount: number, followeeCount: number]> => {
    //     // Pause so we can see the unfollow message. Remove when connected to the server
    //     await new Promise((f) => setTimeout(f, 2000));
    
    //     // TODO: Call the server
    
    //     const followerCount = await getFollowerCount(authToken, userToUnfollow);
    //     const followeeCount = await getFolloweeCount(authToken, userToUnfollow);
    
    //     return [followerCount, followeeCount];
    //   };
}

export default UserInfoPresenter;
