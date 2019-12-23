export type TimeSpan = {
  start: Date;
  end: Date;
  breaks: Date;
  standardWork: Date;
  overwork: Date;
  totalWork: Date;
};

export type TimeSpanCreatorParams = {
  start: Date;
  end: Date;
  breaks?: Date;
};
type TimeSpanCreatorResult = {
  timeSpan?: TimeSpan;
  error: string[];
};
type Validate = (x: TimeSpanCreatorParams) => boolean;
type Validator = {
  validate: Validate;
  message: (x: TimeSpanCreatorParams) => string;
};

const createTimeSpan = (
  parmas: TimeSpanCreatorParams
): TimeSpanCreatorResult => {
  const validators = [
    startShouldBeIn19700101,
    endShouldBeIn19700101,
    endShouldGreaterThanStart,
    breaksShouldLessThanTimeSpan
  ];
  const error = validators.reduce<string[]>((aggr, validator) => {
    return validator.validate(parmas)
      ? aggr
      : [...aggr, validator.message(parmas)];
  }, []);
  if (error.length > 0) return { error };
  const { start, end, breaks = new Date(0) } = parmas;
  const standardWork = new Date(8 * 3600 * 1000);
  const totalWork = new Date(end.getTime() - start.getTime());
  const overwork =
    totalWork > standardWork
      ? new Date(totalWork.getTime() - standardWork.getTime())
      : new Date(0);
  const timeSpan: TimeSpan = {
    start,
    end,
    breaks,
    standardWork,
    totalWork,
    overwork
  };
  return { error, timeSpan };
};

const startShouldBeIn19700101: Validator = {
  validate: x => is19700101(x.start),
  message: x => `start should be in 1970-01-01 but is ${formatDate(x.start)}`
};

const endShouldBeIn19700101: Validator = {
  validate: x => is19700101(x.end),
  message: x => `end should be in 1970-01-01 but is ${formatDate(x.end)}`
};

const endShouldGreaterThanStart: Validator = {
  validate: x => x.start.getTime() < x.end.getTime(),
  message: x =>
    `end should greater than start, but start is ${formatDate(
      x.start
    )}, while end is ${formatDate(x.end)} `
};

const breaksShouldLessThanTimeSpan: Validator = {
  validate: x =>
    x.end.getTime() - x.start.getTime() > (x.breaks?.getDate() ?? 0),
  message: x => `timespan should greater than break`
};

const is19700101 = (date: Date): boolean =>
  date.getTime() > 0 && date.getTime() < new Date(1970, 0, 2).getTime();

const formatDate = (date: Date): string => date.toLocaleDateString();
