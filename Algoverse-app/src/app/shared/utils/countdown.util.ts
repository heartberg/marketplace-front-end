import moment from "moment";

export const isCountdownValid = (timeDiff: moment.Duration) => {
  return !(timeDiff.minutes() < 0 || timeDiff.seconds() < 0);
};

export const countDownFormatter = (timeDiff: moment.Duration) => {
  return [Math.floor(timeDiff.asHours()), timeDiff.minutes(), timeDiff.seconds()].join(':');
}
