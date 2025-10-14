import { User } from "tweeter-shared";
import ItemPresenter from "../ItemPresenter";
import FollowService from "../../../models/FollowService";

abstract class UserItemPresenter extends ItemPresenter<User, FollowService> {
     
    protected serviceFactory(): FollowService {
        return new FollowService();
    }
}

export default UserItemPresenter;
