const ensureMeta = (selector, attribute) => {
  let tag = document.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, selector.match(/="([^"]+)/)?.[1] || '')
    document.head.appendChild(tag)
  }
  return tag
}

export function updatePageMetadata({ title, description, image }) {
  if (title) document.title = title
  if (description) {
    ensureMeta('meta[name="description"]', 'name').content = description
    ensureMeta('meta[property="og:description"]', 'property').content = description
  }
  if (title) ensureMeta('meta[property="og:title"]', 'property').content = title
  if (image) ensureMeta('meta[property="og:image"]', 'property').content = image
  ensureMeta('meta[property="og:url"]', 'property').content = `${window.location.origin}${window.location.pathname}`
}
