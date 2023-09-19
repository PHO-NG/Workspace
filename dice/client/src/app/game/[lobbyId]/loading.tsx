import { FC } from 'react'
import { Loader2 } from 'lucide-react'


const loading: FC = () => {
  return <div className='absolute left-2/4 -translate-x-2/4 top-1/2 -translate-y-2/4'>
      <Loader2 size={400} className='animate-spin -ml-1'/>
    </div>
}

export default loading