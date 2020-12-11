import inquirer from 'inquirer';
import {
  findSong,
  getPunch
} from './main';

const parseArgumentsIntoOptions = (rawArgs) => {
  const args = rawArgs.slice(2);

  return {
    artist: args[0],
    query: args[1]
  };
};

const promptForConfirmation = async (options, results) => {
  const questions = [];

  const searchResults = results.map((el, index) => {
    return index + ' | ' + el.title
  })
  
  questions.push({
    type: 'list',
    name: 'song',
    message: 'Choose',
    choices: searchResults,
    default: false,
    loop: false,
  })

  const answers = await inquirer.prompt(questions)

  return {
    ...options,
    song: answers.song,
    query: options.query,
    url: results[answers.song.substring(0, 1)].url
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const results = await findSong(options.artist, options.query);
  if (!results)  {
    console.log('Nothing Found')
    return;
  }
  (async () => {
    const confirmedSong = await promptForConfirmation(options, results)

    try {
      console.log(await getPunch(confirmedSong));
    } catch (e) {
      throw e
    }
  })()
}