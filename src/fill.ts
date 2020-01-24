import HummusRecipe from 'hummus-recipe'
import { Timesheet } from './timesheet'
import { format } from 'date-fns'
import { Config } from './types'

export const fillForm = (config: Config) => (timesheet: Timesheet) => {
  const pdfDoc = new HummusRecipe('./template.pdf', './output.pdf')
  const actions = [...fillStaticInfo(config), ...fillTimespans(timesheet)]
  actions
    .reduce((prev, act) => act(prev), pdfDoc.editPage(1))
    .endPage()
    .endPDF()
  console.log('done')
}

const fillStaticInfo = (
  config: Config
): Array<(x: HummusRecipe) => HummusRecipe> => {
  const { client, consultant, reportTo } = config
  return [
    p => p.text(consultant.name, 140, 106, large),
    p => p.text(client, 140, 152, large),
    p => p.text(consultant.purchaseOrderNumber, 450, 152, large),
    p => p.text(consultant.name, 130, 611, medium),
    p => p.text(consultant.position, 130, 650, medium),
    p => p.text(reportTo.name, 130, 688, medium),
    p => p.text(reportTo.name, 393, 611, medium),
    p => p.text(reportTo.position, 393, 650, medium),
    p => p.text('N/A', 393, 688, medium),
  ]
}

const fillTimespans = (
  timesheet: Timesheet
): Array<(x: HummusRecipe) => HummusRecipe> => {
  const { startedAt, timeSpans, createdAt, total } = timesheet
  const timeSpansActions: HummusFunc[] = timeSpans
    .map<HummusFunc[]>((timeSpan, index) => {
      const { date, start, end, breaks, totalWork, comment } = timeSpan
      const y = 273 + index * 18.5
      return [
        p => p.text(format(date, 'dd/MM'), 60, y, small),
        ...(start
          ? [(p: HummusRecipe) => p.text(start.formatTime(), 110, y, small)]
          : []),
        ...(end
          ? [(p: HummusRecipe) => p.text(end.formatTime(), 160, y, small)]
          : []),
        ...(breaks
          ? [(p: HummusRecipe) => p.text(breaks.formatTime(), 210, y, small)]
          : []),
        (p: HummusRecipe) => p.text(totalWork.formatTime(), 390, y, small),
        (p: HummusRecipe) => p.text(comment, 445, y, xsmall),
      ]
    })
    .reduce<Array<(x: HummusRecipe) => HummusRecipe>>(
      (acc, item) => [...acc, ...item],
      []
    )
  const totalActions: HummusFunc[] = [
    p => p.text(`${total.formatWorkingDays(8)}`, 390, 531, medium),
    p => p.text(`${format(createdAt, 'dd/MM/yyyy')}`, 130, 725, medium),
    p => p.text(`${format(createdAt, 'dd/MM/yyyy')}`, 393, 725, medium),
    p => p.text(`${format(createdAt, 'dd/MM/yyyy')}`, 450, 106, large),
  ]
  return [...timeSpansActions, ...totalActions]
}

const BLACK = [0, 0, 0]
const large = { color: BLACK, size: 20 }
const medium = { color: BLACK, size: 16 }
const small = { color: BLACK, size: 12 }
const xsmall = { color: BLACK, size: 8 }
type HummusFunc = (x: HummusRecipe) => HummusRecipe
