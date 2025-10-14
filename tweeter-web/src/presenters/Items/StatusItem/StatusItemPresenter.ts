import { Status } from "tweeter-shared";
import ItemPresenter from "../ItemPresenter";
import StatusService from "../../../models/StatusService";


abstract class StatusItemPresenter extends ItemPresenter<Status, StatusService> {
    
    protected serviceFactory(): StatusService {
        return new StatusService();
    }
}

export default StatusItemPresenter;
