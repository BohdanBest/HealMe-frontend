interface AvailabilitySlot {
  dayOfWeek: number;
}

interface CalendarGridProps {
  onSelectDay: (dayIndex: number) => void;
  availability: AvailabilitySlot[];
}

export const CalendarGrid = ({
  onSelectDay,
  availability,
}: CalendarGridProps) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const hasSlots = (dayIndex: number) => {
    return availability.some((slot) => slot.dayOfWeek === dayIndex);
  };

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      const isToday = day === today.getDate();
      const active = hasSlots(dayOfWeek);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""} ${
            active ? "has-slots" : ""
          }`}
          onClick={() => onSelectDay(dayOfWeek)}>
          <span className="day-number">{day}</span>
          {active && <span className="slot-dot" />}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <h2>
          {today.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
      </div>
      <div className="calendar-grid">
        {weekDays.map((d) => (
          <div key={d} className="week-day-name">
            {d}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};
