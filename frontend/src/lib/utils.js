import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function throttle(func, delay) {
  let inThrottle = false
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), delay)
    }
  }
}

export function debounce(func, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// a more complex throttle function don't know why ??
// .
// export function throttle(func, delay) {
//   let wait = false
//   let storedArgs = null
//
//   function checkStoredArgs() {
//     if (storedArgs == null) {
//       wait = false
//     } else {
//       func(...storedArgs)
//       storedArgs = null
//       setTimeout(checkStoredArgs, delay)
//     }
//   }
//
//   return (...args) => {
//     if (wait) {
//       storedArgs = args
//       return
//     }
//     func(...args)
//     wait = true
//     setTimeout(checkStoredArgs, delay)
//   }
// }
//
