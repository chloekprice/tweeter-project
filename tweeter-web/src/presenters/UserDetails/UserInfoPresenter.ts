import { AuthToken, User } from "tweeter-shared";
import UserService from "../../models/UserService";
import { NavigateFunction } from "react-router-dom";

export interface UserInfoView {
    deleteMsg: (_toast: string) => void
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    displayInfoMsg: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    setUser: (user: User) => void
    navigate: NavigateFunction
    setIsFollower: (isFollower: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    setFolloweeCount: (numFollowees: number) => void
    setFollowerCount: (numFollowers: number) => void
}

class UserInfoPresenter {
    private userService: UserService;
    private _view: UserInfoView;

    public constructor(view: UserInfoView) {
        this.userService = new UserService();
        this._view = view;
    }

    public get view(): UserInfoView { return this._view; }

        
    public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void>  {
        var followingUserToast = "";

        try {
            this.view.setIsLoading(true);
            followingUserToast = this.view.displayInfoMsg(`Following ${displayedUser.name}...`, 0);

            const [followerCount, followeeCount] = await this.userService.follow(authToken, displayedUser);

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to follow user because of exception: ${error}`);
        } finally {
            this.view.deleteMsg(followingUserToast);
            this.view.setIsLoading(false);
        }
    }
      
    public getBaseUrl (): string {
        const segments = location.pathname.split("/@");
        return segments.length > 1 ? segments[0] : "/";
    };

    public intializeUserInfo(authToken: AuthToken, currentUser: User, displayedUser: User) {
        this.setIsFollowerStatus(authToken, currentUser, displayedUser);
        this.setNumbFollowees(authToken!, displayedUser!);
        this.setNumbFollowers(authToken!, displayedUser!);
    }

    public async setIsFollowerStatus (authToken: AuthToken, currentUser: User, displayedUser: User)  {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
            }
        } catch (error) {
            this.view.displayErrorMsg(`Failed to determine follower status because of exception: ${error}`);
        }
    };
    
    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
          this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMsg(`Failed to get followees count because of exception: ${error}`);
        }
      };
    
    
    public async setNumbFollowers (authToken: AuthToken, displayedUser: User) {
        try {
            this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMsg(`Failed to get followers count because of exception: ${error}`);
        }
    };

    public switchToLoggedInUser(currentUser: User): void {
        this.view.setUser(currentUser);
        this.view.navigate(`${this.getBaseUrl()}/${currentUser.alias}`);
    };
      
    public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        var unfollowingUserToast = "";

        try {
            this.view.setIsLoading(true);
            unfollowingUserToast = this.view.displayInfoMsg(`Unfollowing ${displayedUser.name}...`, 0);

            const [followerCount, followeeCount] = await this.userService.unfollow(authToken, displayedUser);

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to unfollow user because of exception: ${error}`);
        } finally {
            this.view.deleteMsg(unfollowingUserToast);
            this.view.setIsLoading(false);
        }
    };
}

export default UserInfoPresenter;
