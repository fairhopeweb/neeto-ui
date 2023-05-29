import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as yup from "yup";

import { Switch as FormikSwitch, Form } from "components/formik";

const TestSwitch = ({ onSubmit, schema }) => {
  const handleSubmit = values => {
    onSubmit(values);
  };

  const validationSchema =
    schema ||
    yup.object().shape({
      formikSwitch: yup.boolean(),
    });

  return (
    <Form
      formikProps={{
        initialValues: { formikSwitch: false },
        validationSchema,
        onSubmit: handleSubmit,
      }}
    >
      <FormikSwitch name="formikSwitch" />
      <button type="submit">Submit</button>
    </Form>
  );
};

describe("formik/Switch", () => {
  it("should render without errors", () => {
    render(<TestSwitch />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should submit with correct value", async () => {
    const onSubmit = jest.fn();
    render(<TestSwitch onSubmit={onSubmit} />);
    userEvent.click(screen.getByRole("checkbox"));
    userEvent.click(screen.getByText(/Submit/i));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        formikSwitch: true,
      })
    );
  });

  it("should display error message if submission doesn't pass validationScehma", async () => {
    const onSubmit = jest.fn();
    const validationScehma = yup.object().shape({
      formikSwitch: yup.boolean().isTrue("Switch must be on"),
    });
    render(<TestSwitch schema={validationScehma} onSubmit={onSubmit} />);
    userEvent.click(screen.getByText(/Submit/i));
    expect(await screen.findByText(/Switch must be on/i)).toBeInTheDocument();
  });
});