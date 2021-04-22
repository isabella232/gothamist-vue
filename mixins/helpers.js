import { format, differenceInMinutes, differenceInHours, getYear, isValid } from 'date-fns'

// formats tags into the correct format for radial (for article listing pages)
// name = the article's ancestry's title 'ancestry[0].title' from the CMS API
// slug = the article's ancestry's slug 'ancestry[0].slug' from the CMS API
// sponsored = boolean 'sponsored_content' from the CMS API
// tags = 'tags' array from the CMS API
export const formatTags = function (name, slug, sponsored, tags) {
  const tagArray = [{
    name,
    slug
  }]
  if (sponsored) {
    return [{ name: 'sponsored' }]
  }
  if (tags.find(x => x.name === 'opinion')) {
    tagArray.push({
      name: 'opinion',
      slug: 'opinion'
    })
  }
  return tagArray
}

// returns the article image
// asset = the article's 'lead_asset' from the CMS API
// slug = the article's ancestry's slug 'ancestry[0].slug' from the CMS API
export const getArticleImage = function (asset, slug) {
  if (asset !== undefined && asset.length > 0) {
    if (asset[0].value.image) {
      return asset[0].value.image.file
    }
    if (asset[0].value.default_image) {
      return asset[0].value.default_image.file
    }
  } else {
    switch (slug) {
      case 'arts-entertainment':
        return this.defaultImageArts
      case 'food':
        return this.defaultImageFood
      case 'news':
        return this.defaultImageNews
      default:
        return this.defaultImage
    }
  }
}
// checks if the asset has a gallery or not and return true/false
// asset = the story's 'lead_asset' from the CMS API
export const hasGallery = function (asset) {
  if (asset !== undefined && asset.length > 0) {
    if (asset[0].type === 'lead_gallery') {
      return true
    }
  }
  return false
}

export const amountScrolled = function () {
  const h = document.documentElement
  const b = document.body
  const st = 'scrollTop'
  const sh = 'scrollHeight'
  return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100
}

// capitalize the first letter of a string
export const capitalize = function (string) {
  return string[0].toUpperCase() + string.substring(1)
}

// formats an ISO date to display the time e.g. 6:00pm
export const formatTime = function (time) {
  if (time !== undefined && time !== null) {
    return format(new Date(time), 'h:mm a')
  }
  return null
}

export const fuzzyDateTime = function (utcTimestamp) {
  const JUST_NOW = 'Just now'
  const TIMESTAMP_FORMAT = 'MMM d, yyyy h:mm a'
  const TIMESTAMP_FORMAT_NO_YEAR = 'MMM d, h:mm a'
  const time = new Date(utcTimestamp)
  if (!isValid(time)) {
    return null
  }
  const now = new Date()
  const minutes = differenceInMinutes(now, time)
  const hours = differenceInHours(now, time)
  if (minutes <= 5) {
    return JUST_NOW
  } else if (minutes > 5 && hours < 1) {
    return `${minutes} mins ago`
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (getYear(time) === getYear(now)) {
    return format(time, TIMESTAMP_FORMAT_NO_YEAR)
  } else {
    return format(time, TIMESTAMP_FORMAT)
  }
}

export default {
  methods: {
    amountScrolled,
    capitalize,
    formatTime,
    fuzzyDateTime
  }
}
