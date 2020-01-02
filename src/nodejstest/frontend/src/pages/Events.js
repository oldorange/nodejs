import React, { useState, useEffect, useContext } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

const EventsPage = props => {
    const context = useContext(AuthContext);
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const titleElRef = React.createRef();
    const priceElRef = React.createRef();
    const dateElRef = React.createRef();
    const descriptionElRef = React.createRef();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        const requestBody = {
            query: `
              query {
                events {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
                }
              }
            `
        };

        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const events = resData.data.events;
                setEvents(events);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const eventList = events.map(event => {
        return (
            <li key={event._id} className="events__list-item">
                {event.title}
            </li>
        );
    });

    const startCreateEventHandler = () => {
        setCreating(true);
    };

    const modalConfirmHandler = async () => {
        setCreating(false);
        const title = titleElRef.current.value;
        const price = +priceElRef.current.value;
        const date = dateElRef.current.value;
        const description = descriptionElRef.current.value;

        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            window.confirm("invalid input");
            return;
        }

        const event = { title, price, date, description };
        console.log(event);

        const requestBody = {
            query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
        };

        const token = context.token;
        try {
            let response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            fetchEvents();
            return response.json();
        }
        catch (err) {
            console.log(err);
        };

    };

    const modalCancelHandler = () => {
        setCreating(false);
    };

    return (
        <React.Fragment>
            {creating && <div onClick={modalCancelHandler}><Backdrop /></div>}
            {creating && (
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={dateElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                ref={descriptionElRef}
                            />
                        </div>
                    </form>
                </Modal>
            )}
            {context.token && (
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>
                        Create Event
                    </button>
                </div>
            )}
            <ul className="events__list">{eventList}</ul>
        </React.Fragment>
    );
}

export default EventsPage;