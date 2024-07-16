'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InputText } from './inputText'
import { InputSelect } from './inputSelect'
import { Button } from './button'
import Link from 'next/link'

import styles from './formVideo.module.css'
import { useContext } from 'react'
import { VideosContext } from '../../contexts/VideosContextProvider'
import { IVideo } from '../db'

interface IFormVideoProps {
  onSubmitAction: (video: IVideo) => void
}

export const FormVideo = ({ onSubmitAction }: IFormVideoProps) => {
  const { categoriesList } = useContext(VideosContext)

  const CATEGORIAS = [
    '',
    ...categoriesList.map((category) => category.name),
  ] as const

  const formVideoValidationSchema = z.object({
    titulo: z.string().nonempty({
      message: 'El campo del título es obligatorio.',
    }),
    linkDoVideo: z
      .string()
      .nonempty({
        message: 'El campo del enlace del vídeo es obligatorio.',
      })
      .url({
        message: 'Ingrese un enlace válido.',
      }),
    linkDaImagem: z
      .string()
      .url({
        message: 'Ingrese un enlace válido.',
      })
      .optional()
      .or(z.literal('')),
    categoria: z
      .enum(CATEGORIAS, {
        required_error: 'El campo de categoría es obligatorio.',
      })
      .refine((value) => value !== '', {
        message: 'El campo de categoría es obligatorio.',
      }),
    descricao: z.string().nonempty({
      message: 'El campo de descripción es obligatorio.',
    }),
  })

  type TFormVideoData = z.infer<typeof formVideoValidationSchema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormVideoData>({
    defaultValues: {
      titulo: '',
      linkdelVideo: '',
      linkdelaImagem: '',
      categoria: '',
      descripcion: '',
    },
    resolver: zodResolver(formVideoValidationSchema),
    mode: 'onBlur',
  })

  function onSubmit(formData: TFormVideoData) {
    onSubmitAction({
      title: formData.titulo,
      videoUrl: formData.linkdelVideo,
      imageUrl: formData.linkdelaImagem
        ? formData.linkdelaImagem
        : getYouTubeThumbnailUrlFromVideoUrl(formData.linkdelVideo),
      category: formData.categoria,
      description: formData.descripcion,
    })
    handleResetForm()
  }

  function handleResetForm() {
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>nuevo video</h1>
      <InputText
        {...register('titulo')}
        required
        id="titulo"
        label="Título"
        fullWidth
        error={!!errors.titulo}
        helperText={errors.titulo ? errors.titulo.message : undefined}
      />
      <InputText
        {...register('linkdelVideo')}
        required
        id="link-video"
        label="Link del vídeo"
        fullWidth
        error={!!errors.linkdelVideo}
        helperText={errors.linkdelVideo ? errors.linkdelVideo.message : undefined}
      />
      <InputText
        {...register('linkdelaImagem')}
        id="link-imagem"
        label="Link de la imagem del vídeo"
        fullWidth
        error={!!errors.linkdelaImagem}
        helperText={
          errors.linkdelaImagem ? errors.linkdelaImagem.message : undefined
        }
      />
      <InputSelect
        {...register('categoria')}
        required
        id="categoria"
        label="escribe una categoria"
        labelId="categoria-label"
        formControlProps={{ fullWidth: true }}
        menuItems={CATEGORIAS.map((categoria) => {
          return { value: categoria, children: categoria }
        })}
        error={!!errors.categoria}
        helperText={errors.categoria ? errors.categoria.message : undefined}
      />
      <InputText
        {...register('descripcion')}
        required
        id="descripcion"
        label="Descripcion"
        multiline
        minRows={4}
        fullWidth
        error={!!errors.descripcion}
        helperText={errors.descripcion ? errors.descripcion.message : undefined}
      />
      <div className={styles['button-container']}>
        <Button variantColor="blue" variantSize="sm" type="submit">
          Salvar
        </Button>
        <Button
          variantColor="gray"
          variantSize="sm"
          type="button"
          onClick={handleResetForm}
        >
          Limpar
        </Button>
        <Link href="/adicionar-categoria">
          <Button variantColor="blue" variantSize="md" type="button">
            Nova Categoria
          </Button>
        </Link>
      </div>
    </form>
  )
}

function getYouTubeVideoIdFromUrl(link: string) {
  const regex =
    /(?:\/watch\?v=|\/v\/|\/vi\/|youtu\.be\/|\/embed\/|\/e\/)([\w-]{11})/
  const match = link.match(regex)
  if (match) {
    const id = match[1]
    return id
  }
  return null
}

function getYouTubeThumbnailUrlFromVideoUrl(link: string) {
  const id = getYouTubeVideoIdFromUrl(link)
  if (id) {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  } else {
    return 'http://bit.ly/placeholder-img-yt'
  }
}
