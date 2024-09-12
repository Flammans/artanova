import { useEffect, useState, useCallback } from 'react'

interface ParallaxImageProps {
  imageUrlWebp: string;
  imageUrlJpg: string;
  altText: string;
}

const CONTAINER_STYLES = {
  width: '100%',
  height: '640px',
  minHeight: '320px',
}

const PICTURE_STYLES_BASE = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  transition: 'transform 0.3s ease-out',
}

const IMG_STYLES = {
  width: '100%',
  height: 'auto',
  minHeight: '100%',
  objectFit: 'cover',
  position: 'absolute',
  bottom: '0',
  left: '50%',
  transform: 'translateX(-50%)',
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ imageUrlWebp, imageUrlJpg, altText }) => {
  const [offsetY, setOffsetY] = useState(0)

  const handleScroll = useCallback(() => {
    setOffsetY(window.pageYOffset)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className="relative overflow-hidden mb-40 opacity-80" style={CONTAINER_STYLES}>
      <picture
        className="absolute inset-0 w-full h-full"
        style={{ ...PICTURE_STYLES_BASE, transform: `translateY(${offsetY * 0.20}px)` }}
      >
        <source srcSet={imageUrlWebp} type="image/webp"/>
        <source srcSet={imageUrlJpg} type="image/jpeg"/>
        <img src={imageUrlJpg} alt={altText} style={IMG_STYLES}/>
      </picture>
    </div>
  )
}

export default ParallaxImage
