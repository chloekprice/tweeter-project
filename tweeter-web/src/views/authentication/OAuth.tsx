import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";


interface Props {
    authMethod: String
    icon: IconProp
    tooltipId: string
    infoMessage: string
    displayInfo: (message: string) => void
}

const OAuth = (props: Props) => {


    return (
        <button
            type="button"
            className="btn btn-link btn-floating mx-1"
            onClick={() => props.displayInfo(props.infoMessage) }
        >
            <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={props.tooltipId}>{props.authMethod}</Tooltip>}
            >
            <FontAwesomeIcon icon={props.icon} />
            </OverlayTrigger>
        </button>
    );
}

export default OAuth;
