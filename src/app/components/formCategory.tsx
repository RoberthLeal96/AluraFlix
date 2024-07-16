'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { matchIsValidColor } from 'mui-color-input'
import { InputText } from './inputText'
import { InputColor } from './inputColor'
import { Button } from './button'
import { ICategory } from '../db'
import { v4 as uuidv4 } from 'uuid'

import styles from './formCategory.module.css'
import { useEffect } from 'react'

const formCategoryValidationSchema = z.object({
  nombre: z.string().nonempty({
    message: 'El campo de nombre es obligatorio.',
  }),
  descripción: z.string().nonempty({
    message: 'El campo de descripción es obligatorio.',
  }),
  color: z.string().nonempty({
    message: 'El campo de color es obligatorio.',
  }),
})

type TFormCategoryData = z.infer<typeof formCategoryValidationSchema>

interface IFormCategoryProps {
  values?: ICategory
  onSubmitAction: (category: ICategory) => void
}

export const FormCategory = ({
  values,
  onSubmitAction,
}: IFormCategoryProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormCategoryData>({
    defaultValues: {
      nome: '',
      descricao: '',
      cor: 'rgb(0,0,0)',
    },
    resolver: zodResolver(formCategoryValidationSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (values) {
      setValue('nombre', values.name)
      setValue('descripción', values.description)
      setValue('color', values.rgbColor)
    }
    
  }, [])

  function onSubmit(formData: TFormCategoryData) {
    onSubmitAction({
      id: values ? values.id : uuidv4(),
      description: formData.descripción,
      name: formData.nombre,
      rgbColor: formData.color,
      isBanner: values ? values.isBanner : false,
    })
    handleResetForm()
  }

  function handleResetForm() {
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>Nueva categoria</h1>
      <InputText
        {...register('nombre')}
        required
        id="nombre"
        label="nombre"
        fullWidth
        error={!!errors.nombre}
        helperText={errors.nombre ? errors.nombre.message : undefined}
      />
      <InputText
        {...register('descripción')}
        required
        id="ddescripción"
        label="descripción"
        multiline
        minRows={4}
        fullWidth
        error={!!errors.descripción}
        helperText={errors.descripción ? errors.descripción.message : undefined}
      />
      <Controller
        name="color"
        control={control}
        rules={{ validate: matchIsValidColor }}
        render={({ field }) => (
          <InputColor
            {...field}
            id="color"
            format="rgb"
            error={!!errors.color}
            helperText={errors.color ? errors.color.message : undefined}
          />
        )}
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
      </div>
    </form>
  )
}
