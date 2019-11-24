() => {
  const [startDate, setStartDate] = useState(new Date("2014/02/08"));
  const [endDate, setEndDate] = useState(new Date("2014/02/10"));
  const [shouldCloseOnSelect, setShouldCloseOnSelect] = useState(false);
  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={date => {
          if (endDate) {
            setShouldCloseOnSelect(true);
            setStartDate(date);
            setEndDate(undefined);
          } else if (differenceInCalendarDays(date, startDate) < 0) {
            setShouldCloseOnSelect(false);
            setStartDate(date);
            setEndDate(startDate);
          } else {
            setShouldCloseOnSelect(false);
            setEndDate(date);
          }
        }}
        selectsStart
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        shouldCloseOnSelect={shouldCloseOnSelect}
      />
    </>
  );
};
