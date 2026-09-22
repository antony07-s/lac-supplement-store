const CLOUDINARY_UPLOAD = '/image/upload/'

export function isCloudinaryImage(src) {
  return typeof src === 'string' && src.includes(CLOUDINARY_UPLOAD)
}

export function cloudinaryImage(src, { width, height, crop = 'limit' } = {}) {
  if (!isCloudinaryImage(src)) return src

  const [base, path] = src.split(CLOUDINARY_UPLOAD)
  const transformations = ['f_auto', 'q_auto']
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (width && height) transformations.push(`c_${crop}`)

  // A transformation is the first comma-separated segment after /upload/.
  // Replace it so responsive widths do not stack transformations, including
  // URLs that do not include Cloudinary's optional version segment.
  const [firstSegment, ...remainingPath] = path.split('/')
  const isTransformation = /^(?:[a-z]+_[^,]+)(?:,[a-z]+_[^,]+)*$/.test(firstSegment)
  const cleanedPath = isTransformation ? remainingPath.join('/') : path
  return `${base}${CLOUDINARY_UPLOAD}${transformations.join(',')}/${cleanedPath}`
}

export function cloudinarySrcSet(src, widths, options = {}) {
  if (!isCloudinaryImage(src)) return undefined
  return widths.map((width) => `${cloudinaryImage(src, { ...options, width })} ${width}w`).join(', ')
}
