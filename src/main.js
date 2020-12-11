const axios = require('axios');
const cio = require('cheerio-without-node-native');
const dotenv = require('dotenv').config();

export const getPunch = async (options) => {
  const url = options.url;
  const regex =  new RegExp(removeAccentFromString(options.query), 'i');

  try {
    let { data } = await axios.get(url);
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

    const lyricsArr = lyrics.split('\n');
    let returns = []
    lyricsArr.forEach((item) => {
      const itemCP = removeAccentFromString(item)
      if (itemCP.search(regex) !== -1) {
        returns.push(item)
      }
    });

    return returns.length > 0 ? returns : "Nothing found";
  } catch (e) {
    throw e;
  }
}

export const findSong = async (artist, search) => {
  try {
    const baseUrl = "https://api.genius.com/search?q="
    let query = `${artist} ${search}`
    let url = `${baseUrl}${encodeURI(query)}`
    const headers = {
      Authorization: 'Bearer ' + process.env.CLIENT_ACCESS_TOKEN
    };

    let { data } = await axios.get(url, { headers })
    if (data.response.hits.length === 0) return null;
    const results = data.response.hits.map((val) => {
      const { title, id, url, primary_artist } = val.result;
      return { id, title: title + ' - ' + primary_artist.name, url};
    });
    return results;
  } catch (e) {
    throw e;
  }
}

const removeAccentFromString = (string) => {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}