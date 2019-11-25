import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {
  getDay,
  getMonth,
  getDate,
  newDate,
  isSameDay,
  isDayDisabled,
  isDayExcluded,
  isDayInRange,
  isEqual,
  isBefore,
  isAfter,
  getDayOfWeekCode,
  formatDate
} from "./date_utils";

export default class Day extends React.Component {
  static propTypes = {
    disabledKeyboardNavigation: PropTypes.bool,
    day: PropTypes.instanceOf(Date).isRequired,
    dayClassName: PropTypes.func,
    endDate: PropTypes.instanceOf(Date),
    highlightDates: PropTypes.instanceOf(Map),
    inline: PropTypes.bool,
    month: PropTypes.number,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    preSelection: PropTypes.instanceOf(Date),
    selected: PropTypes.object,
    selectingDate: PropTypes.instanceOf(Date),
    selectsEnd: PropTypes.bool,
    selectsStart: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    renderDayContents: PropTypes.func
  };

  handleClick = event => {
    if (!this.isDisabled() && this.props.onClick) {
      this.props.onClick(event);
    }
  };

  handleMouseEnter = event => {
    if (!this.isDisabled() && this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };

  isSameDay = other => isSameDay(this.props.day, other);

  isKeyboardSelected = () =>
    !this.props.disabledKeyboardNavigation &&
    !this.props.inline &&
    !this.isSameDay(this.props.selected) &&
    this.isSameDay(this.props.preSelection);

  isDisabled = () => isDayDisabled(this.props.day, this.props);

  isExcluded = () => isDayExcluded(this.props.day, this.props);

  getHighLightedClass = defaultClassName => {
    const { day, highlightDates } = this.props;

    if (!highlightDates) {
      return false;
    }

    // Looking for className in the Map of {'day string, 'className'}
    const dayStr = formatDate(day, "MM.dd.yyyy");
    return highlightDates.get(dayStr);
  };

  isInRange = () => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return isDayInRange(day, startDate, endDate);
  };

  isInSelectingRange = () => {
    const {
      day,
      selectsStart,
      selectsEnd,
      selectingDate,
      startDate,
      endDate
    } = this.props;

    if (
      !(selectsStart || selectsEnd) ||
      !selectingDate ||
      this.isDisabled() ||
      endDate
    ) {
      return false;
    }

    return (
      isDayInRange(day, startDate, selectingDate) ||
      isDayInRange(day, selectingDate, startDate)
    );

    // return false;
  };

  isSelectingRangeStart = () => {
    const { day, selectingDate, startDate, endDate, selectsStart } = this.props;

    if (endDate || !selectsStart) {
      return false;
    }

    if (
      selectingDate &&
      isEqual(startDate, day) &&
      isBefore(day, selectingDate)
    ) {
      return true;
    }

    return (
      isSameDay(day, selectingDate) &&
      (isBefore(selectingDate, startDate) || isEqual(selectingDate, startDate))
    );
  };

  isSelectingRangeEnd = () => {
    const { day, selectingDate, startDate, endDate, selectsStart } = this.props;

    if (endDate || !selectsStart) {
      return false;
    }

    if (
      selectingDate &&
      isEqual(startDate, day) &&
      isAfter(day, selectingDate)
    ) {
      return true;
    }

    return (
      isSameDay(day, selectingDate) &&
      (isAfter(selectingDate, startDate) ||
        (endDate && isEqual(selectingDate, endDate)))
    );
  };

  isRangeStart = () => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return isSameDay(startDate, day);
  };

  isRangeEnd = () => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return isSameDay(endDate, day);
  };

  isWeekend = () => {
    const weekday = getDay(this.props.day);
    return weekday === 0 || weekday === 6;
  };

  isOutsideMonth = () => {
    return (
      this.props.month !== undefined &&
      this.props.month !== getMonth(this.props.day)
    );
  };

  getClassNames = date => {
    const dayClassName = this.props.dayClassName
      ? this.props.dayClassName(date)
      : undefined;
    return classnames(
      "react-datepicker__day",
      dayClassName,
      "react-datepicker__day--" + getDayOfWeekCode(this.props.day),
      {
        "react-datepicker__day--disabled": this.isDisabled(),
        "react-datepicker__day--excluded": this.isExcluded(),
        "react-datepicker__day--selected": this.isSameDay(this.props.selected),
        "react-datepicker__day--keyboard-selected": this.isKeyboardSelected(),
        "react-datepicker__day--range-start": this.isRangeStart(),
        "react-datepicker__day--range-end": this.isRangeEnd(),
        "react-datepicker__day--in-range": this.isInRange(),
        "react-datepicker__day--in-selecting-range": this.isInSelectingRange(),
        "react-datepicker__day--selecting-range-start": this.isSelectingRangeStart(),
        "react-datepicker__day--selecting-range-end": this.isSelectingRangeEnd(),
        "react-datepicker__day--today": this.isSameDay(newDate()),
        "react-datepicker__day--weekend": this.isWeekend(),
        "react-datepicker__day--outside-month": this.isOutsideMonth()
      },
      this.getHighLightedClass("react-datepicker__day--highlighted")
    );
  };

  render() {
    return (
      <div
        className={this.getClassNames(this.props.day)}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        aria-label={`day-${getDate(this.props.day)}`}
        role="option"
        aria-disabled={this.isDisabled()}
      >
        {this.props.renderDayContents
          ? this.props.renderDayContents(
              getDate(this.props.day),
              this.props.day
            )
          : getDate(this.props.day)}
      </div>
    );
  }
}
