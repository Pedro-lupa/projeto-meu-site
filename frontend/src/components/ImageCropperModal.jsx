// frontend/src/components/ImageCropperModal.jsx
import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { X } from 'lucide-react'
import getCroppedImg from '../utils/cropImage'
import './ImageCropperModal.css'

const ImageCropperModal = ({ imageSrc, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      onSave(croppedImageBlob) // Envia a imagem final de volta pra ProfilePage
    } catch (e) {
      console.error(e)
      alert("Erro ao cortar imagem")
    }
  }

  return (
    <div className="crop-modal-overlay">
      <div className="crop-modal-container">
        <div className="crop-modal-header">
          <h3>Ajustar Foto</h3>
          <button onClick={onCancel} className="close-btn"><X size={24}/></button>
        </div>

        <div className="crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1} // Força ser quadrado (que vira redondo com a máscara)
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round" // A máscara redonda
            showGrid={false}
          />
        </div>

        <div className="controls">
          <div className="slider-container">
            <Typography variant="overline" className="slider-label">Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(zoom)}
              className="mui-slider"
            />
          </div>
          {/* Se quiser adicionar rotação depois, descomente aqui
          <div className="slider-container">
             <Typography variant="overline">Girar</Typography>
             <Slider value={rotation} min={0} max={360} step={1} onChange={(e, rot) => setRotation(rot)}/>
          </div>
          */}
        </div>

        <div className="crop-modal-actions">
            <Button variant="outlined" onClick={onCancel} style={{color: '#fff', borderColor: '#444'}}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} style={{backgroundColor: '#e100ff'}}>
              Salvar Foto
            </Button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropperModal