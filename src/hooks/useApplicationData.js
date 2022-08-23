import {useState, useEffect} from 'react';
import axios from 'axios';


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({...state, day})

  //Return a new days array with updated spots values
  //Parameters: current state, updated appointments array
  const updateSpots = (state, appointments) => {
    const dayObj = state.days.find(d => d.name === state.day);

    let spots = 0;
    for(const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }

    const day = {...dayObj, spots};
    const days = state.days.map(d => d.name === state.day ? day : d);

    return days;
  }

  //Retrieve required API data on load
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  }, []);
  
  //Book an interview
  //Create new appointments array, replacing the specific appointment
  //Attempt to push the changes to the server
  function bookInterview(id, interview) {
    return new Promise ((resolve,reject) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    axios.put(`/api/appointments/${id}`, {interview: interview})
      .then(() => {
        //Set state with the new appointments / spots values upon success
        const days = updateSpots(state, appointments);
        setState(prev => ({...prev, appointments, days}));
        resolve();
      })
        //Return an error upon failure
      .catch((err) => {
        reject(err);
      })
    });
  };
  
  //Cancel an interview by setting it to null
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id], interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return new Promise ((resolve, reject) => {
      axios.delete(`/api/appointments/${id}`)
        .then(() => {
          //Set state with the new appointments / spots values upon success
          const days = updateSpots(state, appointments);
          setState(prev => ({...prev, appointments, days}));
          resolve();
        })
          //Return an error upon failure
        .catch((err) => {
          reject(err);
        })
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}