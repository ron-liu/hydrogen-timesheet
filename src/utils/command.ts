import { Command, Option } from 'commander'
import { ConfigCommandArguments, RawConfig, CommandValue } from '../types'
import { prompt } from 'enquirer'

export const initCommand = <T>(commandArgs: T): Command => {
  const program = new Command()
  Object.entries(commandArgs)
    .reduce(
      (command, [name, { shortName, description, defaultValue }]) =>
        command.option(
          `-${shortName}, --${name} <${name}>`,
          description,
          defaultValue
        ),
      program
    )
    .parse(process.argv)
  return program
}

export const collectOptions = async <T>(
  program: Command,
  commandArgs: T
): Promise<Partial<CommandValue<T>>> => {
  const config: Partial<CommandValue<T>> = {}
  for (const [name, value] of Object.entries(commandArgs)) {
    const { description, required, parse = (x: any) => x } = value
    const key = name as keyof T
    if (!!program[name]) {
      config[key] = program[name]
      continue
    }
    const answer = (await prompt({
      type: 'input',
      name,
      message: `What is your ${description}?`,
      validate: (x: string) =>
        (required && !!x && !!parse(x)) || (!required && (!x || !!parse(x))),
    })) as any
    config[key] = answer[key]
  }
  return config
}
