import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'
import Button from '../../../components/ui/Button'

interface pageProps {
  
}

const page: FC<pageProps> = async ({}) => {

const session = await getServerSession(authOptions)

  return <Button >hello</Button>
}

export default page