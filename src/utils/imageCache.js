// メモリ内キャッシュ
const imageCache = new Map()

export const getImageDataUrl = async (imagePath) => {
  // キャッシュにある場合はそれを返す
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath)
  }

  try {
    const response = await fetch(imagePath)
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        // キャッシュに保存
        imageCache.set(imagePath, reader.result)
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('画像の変換に失敗しました:', error)
    return imagePath // エラーの場合は元のパスを返す
  }
}

// キャッシュをクリアする関数（必要に応じて）
export const clearImageCache = () => {
  imageCache.clear()
} 