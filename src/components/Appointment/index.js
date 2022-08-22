import React from 'react';
import 'components/Appointment/styles.scss';
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from 'hooks/useVisualMode';
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE="ERROR_SAVE";
const ERROR_DELETE="ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  //Save an appointment given name and interviewer
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    //Transition to saving screen, attempt to save appointment to the server
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => {
        //Display booked appointment upon success
        transition(SHOW);
      })
      .catch(() => {
        //Display error upon failure
        transition(ERROR_SAVE, true);
      });
  };

  function confirmCancel() {
    //Transition to deleting screen, attempt to delete appointment on the server
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() =>  {
        //Display an empty appointment slot upon success
        transition(EMPTY);
      })
      .catch(() => {
        //Display error upon failure
        transition(ERROR_DELETE, true);
      });
  }

  //Return the name of an interviewer given their ID
  function getInterviewerName (interviewerID) {
    for (const interviewer of props.interviewers) {
      if (interviewer.id === interviewerID) {
        return interviewer.name
      }
    }
  }

  return (
    <article data-testid="appointment" className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && 
        <Show
          student={props.interview.student}
          interviewer={getInterviewerName(props.interview.interviewer)}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      }
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onSave={save}
        onCancel={back}
      />}
      {mode === EDIT && <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        interviewers={props.interviewers}
        onSave={save}
        onCancel={back}
      />}
      {mode === SAVING && <Status message={SAVING}/>}
      {mode === DELETING && <Status message={DELETING}/>}
      {mode === CONFIRM && <Confirm 
      message="Are you sure you would like to delete?" 
      onConfirm={confirmCancel}
      onCancel={back}
      />}
      {mode === ERROR_DELETE && <Error onClose={back} message="could not delete appointment"/>}
      {mode === ERROR_SAVE && <Error onClose={back} message="could not save appointment"/>}
    </article>
  );
};