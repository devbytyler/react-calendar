import { useEffect, useRef, useState } from "react";
import "./App.css";

type Event = {
  title: string;
  startTime: Date;
  endTime: Date;
  id: number;
};

function App() {
  const [events, setEvents] = useState<Event[]>([
    { title: "Event Foo", startTime: new Date(), endTime: new Date(), id: 1 },
    { title: "Event Bar", startTime: new Date(), endTime: new Date(), id: 2 },
    { title: "Event Baz", startTime: new Date(), endTime: new Date(), id: 3 },
  ]);

  const [nextId, setNextId] = useState(4);
  const [editing, setEditing] = useState<Event | null>(null);

  const onAddEvent = () => {
    setEvents((old) => {
      return [
        ...old,
        {
          title: `Event New - ${nextId}`,
          startTime: new Date(),
          endTime: new Date(),
          id: nextId,
        },
      ];
    });
    setNextId((old) => old + 1);
  };

  const onDeleteEvent = (id: number) => {
    setEvents((old) => old.filter((event) => event.id !== id));
  };

  const onEditEvent = (event: Event) => {
    setEditing(event);
  };

  const onSave = (event: Event | Omit<Event, "id">) => {
    if ("id" in event) {
      setEvents((old) =>
        old.map((e) => {
          if (e.id !== event.id) return e;
          else return event;
        })
      );
    } else {
      setEvents((old) => [...old, { id: nextId, ...event }]);
    }
  };

  return (
    <main>
      <button onClick={onAddEvent}>+ Add Event</button>
      <h1>Events</h1>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-list-item">
            <div>Name: {event.title}</div>
            <div>Start: {event.startTime.toISOString()}</div>
            <div>End: {event.endTime.toISOString()}</div>
            <button onClick={() => onDeleteEvent(event.id)}>Delete</button>
            <button onClick={() => onEditEvent(event)}>Edit</button>
          </li>
        ))}
      </ul>
      <AddEditModal
        event={editing}
        onCancel={() => setEditing(null)}
        onSave={onSave}
      />
    </main>
  );
}

type AddEditModalProps = {
  onCancel: () => void;
  onSave: (event: Event | Omit<Event, "id">) => void;
  event: Event | null;
};

function AddEditModal(props: AddEditModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [formState, setFormState] = useState<Partial<Event>>(props.event || {});

  useEffect(() => {
    if (props.event) {
      modalRef.current?.show();
    } else {
      modalRef.current?.close();
    }
  }, [props.event]);

  const onSetField = (field: string, value: string) => {
    setFormState((old) => ({ ...old, [field]: value }));
  };

  const handleSave = () => {
    props.onSave({
      id: props.event?.id,
      title: formState.title || "",
      startTime: formState.startTime || new Date(),
      endTime: formState.endTime || new Date(),
    });
    setFormState({});
    props.onCancel();
  };

  useEffect(() => {
    if (props.event) setFormState(props.event);
  }, [props.event]);

  return (
    <dialog ref={modalRef}>
      <strong>Edit event</strong>
      <form className="form">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={formState.title || ""}
          onChange={(e) => onSetField("title", e.target.value)}
        />
        <label htmlFor="title">Start Date</label>
        <input id="title" name="title" />
        <label htmlFor="title">End Date</label>
        <input id="title" name="title" />
      </form>
      <button onClick={props.onCancel}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </dialog>
  );
}

export default App;
