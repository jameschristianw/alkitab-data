const BibleAPI = require('./bible')
const fs = require('fs')

const {transform} = require('camaro')

let bookCount = 66

let chapterCount = 999

let bookname = ""

let chapters = []

let oldBooks = []
let newBooks = []

const asyncApiCall = async () => {
    let version = "v2"

    for(let currentBook = 1; currentBook <= bookCount; currentBook++) {
        currentChapter = 1
        chapterCount = 999

        let jsonData = {}
        chapters = []
        
        for (let currentChapter=1; currentChapter<=chapterCount; currentChapter++){
            const response = await BibleAPI.getCompatibility(currentBook, currentChapter)

            const template = [`bible`, {
                title: 'title-case(title)',
                book: 'number(book)',
                bookname: 'title-case(bookname)',
                chapter: 'number(chapter)',
                chapter_count: 'number(chapter_count)',
                verses: [`verses/verse`, {
                    number: 'number(number)',
                    title: 'title',
                    text: 'text'
                }]
            }]
        
            jsonData = await transform(response.data, template)
        
            if (chapterCount > currentChapter) chapterCount = jsonData[0]['chapter_count']

            bookname = jsonData[0]['bookname']
            const newChapter = {
                chapter_number: jsonData[0]['chapter'],
                verses: jsonData[0]['verses']
            }

            chapters = [
                ...chapters,
                newChapter
            ]
        }

        let newBook = {
            bookname: bookname,
            chapter_count: chapterCount,
            book_number: currentBook,
            chapters: chapters
        }

        if (currentBook <= 39) {
            oldBooks = [
                ...oldBooks,
                newBook
            ]
        } else {
            newBooks = [
                ...newBooks,
                newBook
            ]
        }

        fs.writeFile(`books/${version}/${bookname}.json`, JSON.stringify(newBook, null, 2), (err) => {
            console.log(`Finish writing ${bookname}`);
        })
    }

    let bible = {
        type: "TB",
        books: {
            old_testament: oldBooks,
            new_testament: newBooks
        }
    }

    fs.writeFile(`books/${version}/Alkitab.json`, JSON.stringify(bible, null, 2), (err) => {
        console.log(`Finish writing Alkitab`);
    })
}

asyncApiCall()