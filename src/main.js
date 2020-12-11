const axios = require('axios');
const cio = require('cheerio-without-node-native');
const path = require("path");
const dotenv = require('dotenv').config();

// [\n\r]
// (?<![\w\d])Cagoule sur le jnoun, c'pas du Michaël Youn(?![\w\d])([\n\r])
export const getLyrics = async (options) => {
  // console.log(process.env)
  // options = {
  //   ...options,
  //   targetDirectory: options.targetDirectory || process.cwd(),
  // };

  const url = "https://genius.com/Booba-comme-les-autres-lyrics";

  const string = "Cagoule sur le jnoun, c'pas du Michaël Youn";


  try {
    let {
      data
    } = await axios.get(url);
    const $ = cio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = ''
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem).html()
            .replace(/<br>/g, '\n')
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
          lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
        }
      })
    }
    if (!lyrics) return null;
    console.log(    lyrics.search(string))
    // const indexString =

    return lyrics.trim();
  } catch (e) {
    throw e;
  }





}



export const findSong = async (artist, title) => {

  try {
    const baseUrl = "https://api.genius.com/search?q="
    let query = `${artist} ${title}`
    let url = `${baseUrl}${encodeURI(query)}`
    const headers = {
      Authorization: 'Bearer ' + process.env.CLIENT_ACCESS_TOKEN
    };

    let {
      data
    } = await axios.get(url, {
      headers
    })
    if (data.response.hits.length === 0) return null;
    const results = data.response.hits.map((val) => {
      const {
        title,
        id,
        url,
        primary_artist
      } = val.result;
      return {
        id,
        title: title + ' - ' + primary_artist.name,
        url
      };
    });
    return results;
  } catch (e) {
    throw e;
  }

}