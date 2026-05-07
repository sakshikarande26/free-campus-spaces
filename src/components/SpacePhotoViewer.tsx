import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'

interface SpacePhotoViewerProps {
  photos: string[]
  spaceName: string
}

export default function SpacePhotoViewer({ photos, spaceName }: SpacePhotoViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [brokenIdxs, setBrokenIdxs] = useState<Set<number>>(new Set())
  const [loadedIdxs, setLoadedIdxs] = useState<Set<number>>(new Set())

  // Reset state when photos array changes (different space selected)
  useEffect(() => {
    setCurrentIdx(0)
    setBrokenIdxs(new Set())
    setLoadedIdxs(new Set())
  }, [photos])

  const totalPhotos = photos?.length ?? 0
  const allBroken = totalPhotos > 0 && brokenIdxs.size >= totalPhotos
  const showPlaceholder = totalPhotos === 0 || allBroken

  if (showPlaceholder) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center bg-[#f5f3ef] rounded-t-lg text-slate-400"
        style={{ height: 160 }}
      >
        <ImageOff size={24} strokeWidth={1.8} />
        <div className="text-[12px] mt-2 font-medium text-slate-500">No photos available</div>
      </div>
    )
  }

  // If current image is broken, advance to first non-broken
  let safeIdx = currentIdx
  if (brokenIdxs.has(safeIdx)) {
    const fallback = photos.findIndex((_, i) => !brokenIdxs.has(i))
    safeIdx = fallback >= 0 ? fallback : 0
  }

  const isLoaded = loadedIdxs.has(safeIdx)
  const currentPhoto = photos[safeIdx]

  return (
    <div className="w-full">
      <div
        className="relative w-full bg-[#f5f3ef] rounded-t-lg overflow-hidden"
        style={{ height: 160 }}
      >
        {!isLoaded && <div className="absolute inset-0 bg-[#f5f3ef] animate-pulse" />}
        <img
          key={`${safeIdx}-${currentPhoto}`}
          src={currentPhoto}
          alt={`${spaceName} — photo ${safeIdx + 1}`}
          onLoad={() =>
            setLoadedIdxs((prev) => {
              const next = new Set(prev)
              next.add(safeIdx)
              return next
            })
          }
          onError={() =>
            setBrokenIdxs((prev) => {
              const next = new Set(prev)
              next.add(safeIdx)
              return next
            })
          }
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {totalPhotos > 1 && (
        <div className="flex items-center justify-center gap-1 mt-1">
          {photos.map((_, i) => {
            const isActive = i === safeIdx
            const isBroken = brokenIdxs.has(i)
            return (
              <button
                key={i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                disabled={isBroken}
                onClick={() => setCurrentIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#881c1c]'
                    : isBroken
                    ? 'border border-gray-200 opacity-40'
                    : 'border border-gray-300 hover:border-[#881c1c]'
                }`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
