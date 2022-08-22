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

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  }, []);
  
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
        const days = updateSpots(state, appointments);
        setState(prev => ({...prev, appointments, days}));
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
    });
  };
  
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
          const days = updateSpots(state, appointments);
          setState(prev => ({...prev, appointments, days}));
          resolve();
        })
        .catch((err) => {
          reject(err);
        })
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}