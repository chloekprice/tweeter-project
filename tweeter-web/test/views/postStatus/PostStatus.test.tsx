import { render, screen } from "@testing-library/react"
import PostStatus from "../../../src/views/postStatus/PostStatus"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";
import PostPresenter from "../../../src/presenters/PostPresenter";
import { deepEqual, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Post Status View", () => {

})
