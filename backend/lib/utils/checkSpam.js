const checkSpamInPosts = (array, value, iterations) => {

  for (let i = 0; i < iterations; i++) {
    if (array[i].content === value) {
      return true;
    }
  }
}

const checkSpamInComments = (array, value, iterations) => {

  for (let i = 0; i < iterations; i++) {
    if (array[i].content === value) {
      return true;
    }
  }
}

module.exports = {
  checkSpamInPosts,
  checkSpamInComments
}