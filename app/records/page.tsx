import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link';



const Records = () => {
  return (
    <div>
      <Button>
        <Link href="/records/new">New Record</Link>
      </Button>
      
      </div>
  )
}

export default Records