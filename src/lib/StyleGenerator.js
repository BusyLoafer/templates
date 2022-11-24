import { DEFAULT_WIDTH } from "./config";

export const generateImageStyle = (pictureData, coef = 1, onlySize = false, zIndexCheck = true) => {

  const style = {
    height: pictureData.height ? pictureData.height * coef : 150 * coef,
  }
  if (zIndexCheck) {
    style.zIndex = pictureData.zIndex || 1;
  }
  if (pictureData.width) {
    style.width = pictureData.width * coef
  }
  if (pictureData.visibility !== undefined && !pictureData.visibility) {
    style.display = "none"
    style.position = "relative"
  }
  if ((pictureData.y || pictureData.x) && !onlySize) {
    style.top = pictureData.y * coef;
    style.left = pictureData.x * coef
  }
  if (pictureData.zIndex) {
    style.zIndex = pictureData.zIndex
  }
  return style;
}

export const generateAudioImageStyle = (pictureData, coef = 1, onlySize = false) => {
  const heightCoef = pictureData.origHeight / pictureData.origWidth;
  const style = {
    height: pictureData.width * heightCoef * coef,
    width: pictureData.width * coef,
    zIndex: pictureData.zIndex || 1,
  }
  if ((pictureData.y || pictureData.x) && !onlySize) {
    style.top = pictureData.y * coef;
    style.left = pictureData.x * coef
  }
  if (pictureData.zIndex) {
    style.zIndex = pictureData.zIndex
  }
  return style;
}

export const generateBigImageStyle = (size) => {
  return {
    height: size,
    width: size,
    resizeMode: "contain"
  }
}

export const generateTextStyle = (textData, coef = 1, fontScale = 1) => {
  const dW = textData.width >= DEFAULT_WIDTH ? 0 : 10;
  const style = {
    textAlign: textData.align,
    color: textData.color,
    height: textData.height * coef,
    width: (textData.width + dW) * coef,
    top: textData.y * coef,
    left: textData.x * coef,
    zIndex: textData.zIndex || 1,
    fontFamily: "Nunito-Bold",
  }
  if (textData.visibility !== undefined && !textData.visibility) {
    style.display = "none"
    style.position = "relative"
  }
  if (textData.size) {
    style.fontSize = parseInt(textData.size) * coef / fontScale;
  }
  if (textData.style) {
    style.fontWeight = textData.style.toString();
  }
  if (textData.zIndex) {
    style.zIndex = textData.zIndex
  }
  return style;
}

export const generateStaticTextStyle = (textData, coef = 1, fontScale = 1) => {
  const style = {
    textAlign: textData.align,
    color: textData.color,
    fontFamily: "Nunito-Bold"
  }
  if (textData.size) {
    style.fontSize = parseInt(textData.size) * coef / fontScale;
  }
  if (textData.style) {
    style.fontWeight = textData.style.toString();
  }
  return style;

}

export const generateSoundStyle = (soundData, coef = 1) => {
  return {
    top: soundData.y * coef,
    left: soundData.x * coef,
    zIndex: soundData.zIndex,
  }
}

export const generateFontSize = (initialValue = 14, coef = 1, fontScale = 1) => {
  return parseInt(initialValue) * coef / fontScale;
}