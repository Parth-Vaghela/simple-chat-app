//for a message
const generateMessage = (text) => {
  return {
    text,
    createdAt : new Date().getTime()
  }
}

//for generating locatin message 
const generateLocationMessage = (url) => {
  return {
    url,
    createdAt : new Date().getTime()
  }
}

module.exports = { generateMessage ,  generateLocationMessage }