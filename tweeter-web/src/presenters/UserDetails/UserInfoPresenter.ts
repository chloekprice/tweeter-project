import { AuthToken, User } from "tweeter-shared";
import UserService from "../../models/UserService";
import { NavigateFunction } from "react-router-dom";
import BasePresenter, { EnhancedView } from "../BasePresenter";

export interface UserInfoView extends EnhancedView {
    setUser: (user: User) => void
    navigate: NavigateFunction
    setIsFollower: (isFollower: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    setFolloweeCount: (numFollowees: number) => void
    setFollowerCount: (numFollowers: number) => void
}

class UserInfoPresenter extends BasePresenter<UserInfoView> {
    private userService: UserService;

    public constructor(view: UserInfoView) {
        super(view);
        this.userService = new UserService();
    }

        
    public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void>  {
        this.updateUserFollowStatus(displayedUser.name, true, async ()  => {
            return await this.userService.follow(authToken, displayedUser)
        })
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
        await this.performThrowingFunction( async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
            }
        }, "determine follower status")
    };
    
    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        await this.performThrowingFunction( async () => {
            this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count")
      };
    
    
    public async setNumbFollowers (authToken: AuthToken, displayedUser: User) {
        await this.performThrowingFunction( async () => {
            this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
        }, "get followers count")
    };

    public switchToLoggedInUser(currentUser: User): void {
        this.view.setUser(currentUser);
        this.view.navigate(`${this.getBaseUrl()}/${currentUser.alias}`);
    };
      
    public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        this.updateUserFollowStatus(displayedUser.name, false, async ()  => {
            return await this.userService.unfollow(authToken, displayedUser)
        })
    };

    private async updateUserFollowStatus(displayedUserName: string, willFollow: boolean, changeFollowStatus: () => Promise<[number, number]>): Promise<void> {
        var followingUserToast = "";
        
        await this.performThrowingFunction( async () => {
            this.view.setIsLoading(true);
            followingUserToast = this.view.displayInfoMsg(`${willFollow ? "Following" : "Unfollowing"} ${displayedUserName}...`, 0);

            const [followerCount, followeeCount] = await changeFollowStatus();

            this.view.setIsFollower(willFollow);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, willFollow ? "follow user" : "unfollow user").then( () => {
            this.view.deleteMsg(followingUserToast);
            this.view.setIsLoading(false);
        })
    }
}

export default UserInfoPresenter;
