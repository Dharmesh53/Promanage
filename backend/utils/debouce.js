const debouce = (func, delay) => {
  // timer variable to keep track of request can abort the previous timeout if new call is made
  let timer;

  return (...args) => {
    // clear the previous call
    clearTimeout(timer);

    // create a new timeout of provided delay
    timer = setTimeout(() => {
      // call the function if delay completed
      func.apply(this, args);
    }, delay);
  };
};

module.exports = debouce;
