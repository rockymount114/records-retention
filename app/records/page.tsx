import React from 'react'
import { Button } from '@radix-ui/themes';
import Link from 'next/link';
const Records = () => {
  return (
    <div><Button><Link href="/records/new">New Record</Link></Button></div>
  )
}

export default Records