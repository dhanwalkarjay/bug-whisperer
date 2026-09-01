import { useState, useRef, useCallback } from 'react'
import { Camera, X, Aperture, RotateCcw, Check, Loader2 } from 'lucide-react'

export default function CameraInput({ onCapture }) {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      setStream(mediaStream)
      setIsOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      alert('Camera access is needed to photograph stack traces. Please enable camera permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsOpen(false)
    setCapturedImage(null)
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageData)
    stopCamera()
  }, [stopCamera])

  const processImage = useCallback(async () => {
    if (!capturedImage) return

    setIsProcessing(true)

    // Simulate OCR processing (in production, you'd use Tesseract.js or a cloud OCR API)
    // For now, we'll use a simple approach and ask the user to also paste the text
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, you'd use:
    // 1. Tesseract.js for client-side OCR
    // 2. Or Google Cloud Vision API
    // 3. Or extract text from the image

    setIsProcessing(false)
    onCapture(capturedImage)
    setCapturedImage(null)
  }, [capturedImage, onCapture])

  const retake = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  return (
    <>
      {/* Camera Button */}
      <button
        type="button"
        onClick={startCamera}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-board-accent border border-board-border text-board-text
          hover:bg-board-border hover:text-board-highlight
          transition-all duration-200 text-sm font-medium
          active:scale-95"
      >
        <Camera size={18} />
        <span className="hidden sm:inline">Photograph Trace</span>
        <span className="sm:hidden">Camera</span>
      </button>

      {/* Camera Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-board-card rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-board-border">
              <div className="flex items-center gap-2">
                <Camera size={20} className="text-board-pin" />
                <span className="font-medium text-board-highlight">
                  {capturedImage ? 'Review Photo' : 'Capture Stack Trace'}
                </span>
              </div>
              <button
                onClick={stopCamera}
                className="p-2 rounded-lg hover:bg-board-accent transition-colors"
              >
                <X size={20} className="text-board-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="relative aspect-[4/3] bg-black">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured stack trace"
                  className="w-full h-full object-contain"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder overlay */}
              {!capturedImage && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-8 border-2 border-board-pin/50 rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-white/70 bg-black/50 rounded-lg p-2">
                    Position the stack trace within the frame
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center justify-center gap-3">
              {!capturedImage ? (
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center
                    hover:bg-white/90 active:scale-95 transition-all duration-200
                    shadow-lg"
                >
                  <Aperture size={32} className="text-board-bg" />
                </button>
              ) : (
                <>
                  <button
                    onClick={retake}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                      bg-board-accent border border-board-border text-board-text
                      hover:bg-board-border transition-all duration-200"
                  >
                    <RotateCcw size={16} />
                    Retake
                  </button>
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl
                      bg-gradient-to-r from-board-pin to-board-highlight text-board-bg
                      font-semibold hover:from-board-highlight hover:to-board-pin
                      transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Use Photo
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
