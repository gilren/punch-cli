import arg from 'arg';
import inquirer from 'inquirer';
import {
  findSong,
  getLyrics
} from './main';


const parseArgumentsIntoOptions = (rawArgs) => {
  // paramter to omit title
  const args = arg({
    '--json': Boolean,
    '--j': '--json',
  }, {
    argv: rawArgs.slice(2)
  });

  return {
    json: args['--json'] || false,
    artist: args._[0],
    title: args._[1]
  };
};


const promptForConfirmation = async (options, searchResults) => {
  const defaultTemplate = 'Javascript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];


  questions.push({
    type: 'list',
    name: 'song',
    message: 'Choose',
    choices: searchResults,
    default: false,
    loop: false,
  })


  questions.push({
    type: 'input',
    name: 'string',
    message: 'String to search'
  })


  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    song: answers.song,
    query: answers.string
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  (async () => {
    const results = await findSong(options.artist, options.title)
    const searchResults = results.map((el) => {
      return el.title
    })
    const aze = await promptForConfirmation(options, searchResults);
    await getLyrics(options);

    console.log(aze)

  })()


}