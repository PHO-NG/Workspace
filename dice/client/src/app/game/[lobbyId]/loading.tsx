import { FC } from 'react'
import { Loader2 } from 'lucide-react'


const loading: FC = () => {
  return <Loader2 size={200} className='animate-spin -ml-1' />
}

export default loading