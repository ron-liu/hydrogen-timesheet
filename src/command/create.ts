import { CreateCommandArguments } from '../types'
import { parse } from 'date-fns'
import { initCommand } from 'src/utils/command'
import { validateRawConfg } from 'src/config/create-config'
import Conf from 'conf'

const conf = new Conf()
const createArguments: CreateCommandArguments = {
  countOfDays: {
    shortName: 'c',
    description: 'count of days (1-14)',
    required: true,
    parse: (n: string) => {
      const r = parseInt(n)
      if (!r || r > 14 || r < 1) return undefined
      return r
    },
    defaultValue: 14,
  },
  createDate: {
    shortName: 'c',
    description: 'date created, d/m/yy',
    defaultValue: new Date(),
    required: true,
    parse: (n: string) => {
      return parse(n, 'd/M/yy', new Date())
    },
  },
  startedAt: {
    shortName: 's',
    description: 'date started, d/m/yy',
    defaultValue: new Date(),
    required: true,
    parse: (n: string) => {
      return parse(n, 'd/M/yy', new Date())
    },
  },
}

const run = async () => {
  const errors = validateRawConfg(conf.store)
  if (errors.length > 0) {
    console.error('No Config found, run config command first')
    process.exit(-1)
  }

  const program = initCommand(createArguments)
  
}
