import React from "react";

import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as yup from "yup";

import { TreeSelect as FormikTreeSelect, Form } from "components/formik";

const treeData = [
  { id: 1, value: 1, label: "Category 1", pId: null },
  { id: 2, value: 2, label: "Category 2", pId: null },
  { id: 3, value: 3, label: "Category 3", pId: null },
  { id: 4, value: 4, label: "Category 1-1", pId: 1 },
  { id: 5, value: 5, label: "Category 2-1", pId: 2 },
];

const TreeSelectComponent = ({ onSubmit }) => (
  <Form
    formikProps={{
      initialValues: { formikTreeSelect: "" },
      validationSchema: yup.object({
        formikTreeSelect: yup.string().required("Value is required"),
      }),
      onSubmit: values => onSubmit(values),
    }}
  >
    <FormikTreeSelect
      showSearch
      label="Formik TreeSelect"
      name="formikTreeSelect"
      treeData={treeData}
    />
    <button type="submit">Submit</button>
  </Form>
);

describe("formik/TreeSelect", () => {
  it("should render without error", () => {
    render(<TreeSelectComponent />);

    expect(screen.getByText("Formik TreeSelect")).toBeInTheDocument();
  });

  it("should show available options when clicked", () => {
    render(<TreeSelectComponent />);

    const select = screen.getByRole("combobox");
    userEvent.click(select);
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
    expect(screen.getByText("Category 3")).toBeInTheDocument();
  });

  it("should should show no options if the input deosn't match any options", () => {
    render(<TreeSelectComponent />);

    const select = screen.getByRole("combobox");
    userEvent.click(select);
    userEvent.type(select, "Invalid Option");
    expect(screen.getByText("No options")).toBeInTheDocument();
  });

  it("should submit with the chosen option", async () => {
    const onSubmit = jest.fn();
    render(<TreeSelectComponent onSubmit={onSubmit} />);

    const select = screen.getByRole("combobox");
    userEvent.click(select);
    userEvent.click(screen.getByText(treeData[0].label));
    userEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        formikTreeSelect: treeData[0].value,
      })
    );
  });

  it("should display validation error when invalid input is provided", async () => {
    render(<TreeSelectComponent />);
    userEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText("Value is required")).toBeInTheDocument();
  });
});