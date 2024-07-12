import { useEffect, useState } from 'react'
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import supabase from '../components/Supabase';
import defaultAvatar from '../images/default-avatar.png'; // Import a default avatar image

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar); // Set the default avatar as the initial state
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
    else setAvatarUrl(defaultAvatar); // If no custom URL is provided, use the default avatar
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

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
      <img
        src={avatarUrl}
        alt="Avatar"
        className="avatar image"
        style={{ height: size, width: size }}
      />
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
          onChange={uploadAvatar}
          disabled={uploading}
          />
        </Button>
      </div>
    </div>
  )
}
