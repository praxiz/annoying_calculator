import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import FrontPage from "./index";

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <FrontPage />
    </Provider>
  );

  expect(screen.getByText(/learn/i)).toBeInTheDocument();
});
