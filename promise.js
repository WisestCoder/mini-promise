(function(window) {
  function Promise(fn) {
    var state = 'pending',
        value = null,
        reason = null,
        callbacks = [],
        errCallbacks = [];
  
    function isFunction (fn) {
      return Object.prototype.toString.call(fn) === '[object Function]';
    }
  
    this.then = function (onFulfilled, onRejected) {
      return new Promise(function (resolve, reject) {

        function handle(value) {
          var ret = isFunction(onFulfilled) && onFulfilled(value) || value;
          // 当ret为promise对象时，手动执行.then方法
          if(ret && isFunction(ret.then)) {
            ret.then(function(value){
              resolve(value);
            });
          } else {
            resolve(ret);
          }
        }

        function errback(reason) {
          reason = isFunction(onRejected) && onRejected(reason) || reason;
          reject(reason);
        }
        
        if (state === 'pending') {
          callbacks.push(handle);
          errCallbacks.push(errback);
        } else if (state === 'fulfilled') {
          handle(value);
        } else if (state === 'rejected') {
          errback(reason);
        }
      });
    };
  
    function resolve(newValue) {
      value = newValue;
      state = 'fulfilled';
      setTimeout(function () {
        callbacks.forEach(function (callback) {
          callback(value);
        });
      }, 0);
    }
  
    function reject(newReason) {
      reason = newReason;
      state = 'rejected';
      setTimeout(function () {
        callbacks.forEach(function (callback) {
          callback(reason);
        });
      }, 0);
    }
  
    fn(resolve);
  }
  window.Promise = Promise;
})(window)