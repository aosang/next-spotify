'use client'
import useUploadModal from "@/hooks/useUploadModal"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import Input from "./Input"
import Button from "./Button"

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const uploadModal = useUploadModal()
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      image: null,
      song: null,
    }
  })

  const onChange = (open: boolean) => {
    if (!open) {
      reset()
      uploadModal.onClose()
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = (values) => {

  }

  return (
    <Modal
      title="Add a Song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input 
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input 
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />

        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input 
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input 
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          Create
        </Button>
      </form>
      
    </Modal>
  )
}

export default UploadModal