import { useEffect, useState } from 'react'

//does this just add a timer?
//no no no debouncing is like this when we're typing our search we dont want to submit a search request for every single keystroke that would be wasteful
//example searching for a song like 'diamonds' we dont want to send a request for 'd' then 'di' then 'dia' and so on, we only want to send the request once the user has finished typing diamonds or in this case if the user doesnt type for 500ms after the last keystroke
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
