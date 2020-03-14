# Hydrogen agent Timesheet creator

## Why I create this repo

I am a contractor with Hydrogen at the time when I am writing this readme.

Hydrogen didn't have a online timesheet system, which means we have to print out a empty timesheet and manually fill all the details.

Because of those tedious steps, I created this repo aims to alleviate the pain.

## How to use it

### Prerequirement

- Running on Mac (I havn't tested on windows yet)
- Node 12 (Not compatible with Node 13)

### Config

Save your profile into your local file, and you don't need to enter same information every time when creating time sheet.

Run `npx hydrongen-timesheet config` , and follow the instructions

### Create timesheet

Create timesheet by asking a few questions

Run `npm hydrongen-timesheet create`, and follow the instructions. After that, it will generate the pdf.
