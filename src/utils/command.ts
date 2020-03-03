import { Command, Option } from 'commander'
import { CommandValue, CommandArgument } from '../types'
import { prompt, Question } from 'inquirer'

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
    const key = name as keyof T
    if (!!program[name]) {
      ret[key] = program[name]
      continue
    }
    const answer = (await prompt([mapCommandArgument(name, value)])) as any
    ret[key] = answer[key]
  }
  return ret
}

export const mapCommandArgument = <T>(
  name: string,
  {
    type,
    description,
    defaultValue,
    required,
    parse = (x: any) => x,
  }: CommandArgument<T>
): Question => {
  return {
    name,
    type: type === 'toggle' ? 'confirm' : 'input',
    default: defaultValue,
    message: `What is ${description} ?`,
    validate: (x: string) =>
      (required && !!x && !!parse(x)) || (!required && (!x || !!parse(x))),
  }
}
