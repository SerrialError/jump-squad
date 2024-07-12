import { useEffect, useState } from 'react'
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import supabase from '../components/Supabase';

export default function InsertForm({ url, size, onUpload }) {
  const [formUrl, setFormUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('statistics').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setFormUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  async function uploadForm(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('statistics').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {formUrl ? (
        <img
          src={formUrl}
          alt="Form"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
      <div>
        <Button
          variant="contained"
          color="primary"
          component="label"
          startIcon={<UploadIcon />}
        >
          {uploading ? 'Uploading ...' : 'Upload'}
          <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadForm}
          disabled={uploading}
          />
        </Button>
      </div>
    </div>
  )
}
