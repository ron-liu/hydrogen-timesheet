# Hydrogen agent Timesheet creator

I am a contractor with Hydrogen at the time when I am writing this readme. 
Hydrogen didn't have a online timesheet system, which means we have to print out a empty timesheet and manually fill all the details,  which is super time consuming. 
This repo aims to alleviate the pain. 

## How to use it

### Prerequirement
* Running on Mac (I havn't tested on windows yet)
* Node 12 (Not compatible with Node 13)

### Steps
1. `git clone https://github.com/ron-liu/hydrogen-timesheet.git`
2. `cd hydrogen-timesheet && npm i`
3. Setup your profile locally: `npm run dev -- config` 
4. Create timesheet pdf: `npm run dev -- create`
