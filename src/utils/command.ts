import { Command, Option } from 'commander'
import { ConfigCommandArguments, RawConfig, CommandValue } from '../types'
import { prompt } from 'enquirer'

export const initCommand = <T>(commandArgs: T): Command => {
  const program = new Command()
  Object.entries(commandArgs)
    .reduce(
      (command, [name, { shortName, description, defaultValue }]) =>
        command.option(`-${shortName}, --${name} <${name}>`, description),
      program
    )
    .parse(process.argv)
  return program
}

export const collectOptions = async <T>(
  program: Command,
  commandArgs: T
): Promise<Partial<CommandValue<T>>> => {
  const ret: Partial<CommandValue<T>> = {}
  for (const [name, value] of Object.entries(commandArgs)) {
    const { description, required, parse = (x: any) => x, defaultValue } = value
    const key = name as keyof T
    if (!!program[name]) {
      ret[key] = program[name]
      continue
    }
    const answer = (await prompt({
      type: 'input',
      name,
      message: `What is your ${description}?`,
      initial: defaultValue,
      validate: (x: string) =>
        (required && !!x && !!parse(x)) || (!required && (!x || !!parse(x))),
    })) as any
    ret[key] = answer[key]
  }
  return ret
}
