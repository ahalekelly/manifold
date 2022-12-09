import { Image } from '@tiptap/extension-image'
import clsx from 'clsx'
import { useState } from 'react'

export const DisplayImage = Image.extend({
  renderReact: (attrs: any) => <ExpandingImage {...attrs} />,
})

function ExpandingImage(props: { src: string; alt?: string; title?: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <img
      {...props}
      onClick={() => setExpanded((expanded) => !expanded)}
      className={clsx('cursor-pointer', !expanded && 'max-h-32')}
    />
  )
}