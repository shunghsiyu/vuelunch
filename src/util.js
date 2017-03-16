export const checksum = function (inputString) {
  let hash = 0

  if (inputString === undefined || inputString === null) {
    return hash
  }

  let strlen = inputString.length

  if (strlen === 0) {
    return hash
  }

  let i = 0
  let c = 0

  for (i = 0; i < strlen; i++) {
    c = inputString.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash = hash & hash // Convert to 32bit integer
  }

  return hash
}
