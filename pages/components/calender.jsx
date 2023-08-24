// import Layout from "@/components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";

export default function CalendarPage() {
  const handlecreate = () => {
    console.log("hello btn clicked");
  };
  // const datebtn = document.getElementsByClassName("fc-daygrid-day-frame");

  // datebtn.addEventListner("click", handlecreate);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[
          resourceTimelinePlugin,
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
        ]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,resourceTimelineWeek,timeGridWeek",
        }}
        initialView="dayGridMonth"
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        resources={[
          { id: "a", title: "Auditorium A" },
          { id: "b", title: "Auditorium B", eventColor: "green" },
          { id: "c", title: "Auditorium C", eventColor: "orange" },
        ]}
        initialEvents={[
          { title: "nice event", start: new Date(), resourceId: "b" },
          {
            title: "TEST EVENT",
            start: new Date("2023-08-25"),
            resourceId: "b",
          },
        ]}
      />
    </div>
  );
}
