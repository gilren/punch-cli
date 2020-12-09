import arg from 'arg';
import inquirer from 'inquirer';
import { findSong, getLyrics } from './main';


const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      '--json' : Boolean,
      '--j' : '--json',
    }, {
      argv: rawArgs.slice(2)
    }
    );
    return {
      json: args['--json'] || false
    }
};

const promptForMissingOptions = async (options, test) => {
  const defaultTemplate = 'Javascript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];

  try {
    questions.push({
      type: 'list',
      name: 'song',
      message: 'Please confirm the right song',
      choices: test,
      default: false,
    })
  } catch (e) {
    throw e
  }
    
  


  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    song: answers.song

  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  (async () => {
    let results = await findSong('alpha wann', 'prada')
    const test = await getLyrics(options);
    results = results.map((el) => {
      console.log(el.title)
        return el.title
    })
    promptForMissingOptions(options, results);
  
  })()
  

}



