const axios = require('axios');
const path = require("path");
const dotenv = require('dotenv').config();


export const getLyrics = async (options) => {
  // console.log(process.env)
  // options = {
  //   ...options,
  //   targetDirectory: options.targetDirectory || process.cwd(),
  // };


  try {
    return findSong('alkpote', 'sucez moi')
  } catch(e) {
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
    
    let { data } = await axios.get(url, {headers})
    if (data.response.hits.length === 0) return null;
    const results = data.response.hits.map((val) => {
      const { full_title, id, url } = val.result;
      return { id, title: full_title, url };
		});
    return results;
  } catch(e) {
    throw e;
  }

}