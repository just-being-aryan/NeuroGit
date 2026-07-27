import Image from 'next/image'

// logo.png contains both the icon mark and a baked-in "NeuroGit" wordmark
// (invisible on dark backgrounds). This crops the source image down to just
// the icon region (x:44-184, y:72-212 in the 534x256 source) so it can be
// paired with a separate, visible text label.
const SOURCE_WIDTH = 534
const SOURCE_HEIGHT = 256
const CROP_X = 44
const CROP_Y = 72
const CROP_SIZE = 140

export function NeuroGitIcon({size = 40, className = ''}: {size?: number; className?: string}) {
  const scale = size / CROP_SIZE
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`} style={{width: size, height: size}}>
      <Image
        src="/logo.png"
        alt="NeuroGit icon"
        width={SOURCE_WIDTH}
        height={SOURCE_HEIGHT}
        style={{
          position: 'absolute',
          width: SOURCE_WIDTH * scale,
          height: SOURCE_HEIGHT * scale,
          left: -CROP_X * scale,
          top: -CROP_Y * scale,
          maxWidth: 'none',
        }}
      />
    </div>
  )
}
