const bucketMarker = "/product-images/";

export function getProductImagePath(url: string) {
  const markerIndex = url.indexOf(bucketMarker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + bucketMarker.length).split("?")[0]);
}
