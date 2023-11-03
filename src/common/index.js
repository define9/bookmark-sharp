export const PageType = {
  None: 0,
  Bookmark: 1,
  Setting: 2,
  About: 3,
}

const keyRoot = 'bookmark-sharp'
export const DBKey = {
  root: keyRoot,
  origin: `${keyRoot}_bookmark_origin`,
  flattening: `${keyRoot}_bookmark_flattening`,
  processed: `${keyRoot}_bookmark_processed`,
  recently: `${keyRoot}_bookmark_recently`,
}