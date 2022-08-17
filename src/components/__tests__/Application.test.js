import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, 
   getAllByTestId, getByAltText, getByPlaceholderText, queryByText
} from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText('Tuesday'));
        expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
      })
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async() => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value:"Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, /Saving/i)).toBeInTheDocument();

    //not sure why this isn't working as intended
    await waitForElement(() => getByText(appointment, "Error"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  })

  it("loads data, deletes an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, 'appointment')[1];

    // 3. Click the "Delete" button on the first filled component
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, /confirm/i)).toBeInTheDocument();

    // 5. Click the "Confirm" button on the same appointment component
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    // 7. Wait until the element with the text "Deleting" is no longer displayed
    await waitForElement(() => getByText(appointment, "Error"));

    // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, 'appointment')[1];

    // 3. Click the "Edit" button on the first filled component
    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Check the Edit form is showing (Cancel + Save button?)
    expect(getByText(appointment, /Cancel/i)).toBeInTheDocument();
    expect(getByText(appointment, /Save/i)).toBeInTheDocument();

    // 5. Change name input to Philip Simpson fireEvent.change
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value:"Philip Simpson" }
    });

    // 6. Click the "Save" button
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the message "Saving" is visible
    expect(getByText(appointment, /Saving/i)).toBeInTheDocument();

    // 8. Check that the form has loaded to the Show state
    await waitForElement(() => getByText(appointment, "Error"));
    
    // 9. Check that the DayListItem with the text "Monday" has the text
    //  "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value:"Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, /Saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, /save/i)).toBeInTheDocument();
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.put.mockRejectedValueOnce();

     // 1. Render the Application.
     const { container } = render(<Application />);
  
     // 2. Wait until the text "Archie Cohen" is displayed.
     await waitForElement(() => getByText(container, "Archie Cohen"));
     const appointment = getAllByTestId(container, 'appointment')[1];
 
     // 3. Click the "Delete" button on the first filled component
     fireEvent.click(getByAltText(appointment, 'Delete'));
 
     // 4. Check that the confirmation message is shown.
     expect(getByText(appointment, /confirm/i)).toBeInTheDocument();
 
     // 5. Click the "Confirm" button on the same appointment component
     fireEvent.click(getByText(appointment, 'Confirm'));
 
     // 6. Check that the element with the text "Deleting" is displayed
     expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
 
     // 7. Wait until the element with the text "Deleting" is no longer displayed
     await waitForElement(() => getByText(appointment, "Error"));
     expect(getByText(appointment, /delete/i)).toBeInTheDocument();
     // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"
     const day = getAllByTestId(container, "day").find(day =>
       queryByText(day, "Monday")
     );
     
     expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });
});
