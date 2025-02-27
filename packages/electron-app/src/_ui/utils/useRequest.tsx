import useSWR from 'swr'
import axios from 'axios'

export default function useRequest(request, { fallbackData, ...config } : any = {}) {
  return useSWR(
    request && request() && request().url,
    () => axios(request() || {}).then(response => response.data),
    {
      ...config,
    }
  ) 
} 