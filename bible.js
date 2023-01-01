const axios = require("axios");
const BASE_URL = `https://alkitab.sabda.org/api`
module.exports = {
    getCompatibility: (book, chapter) => axios({
        method:"POST",
        url : BASE_URL + `/chapter.php?`,
        params: {
            book: book,
            chapter: chapter,
        }
    })
}