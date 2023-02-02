import React, { useState } from 'react'
import './Modal.css'


interface IModalRequiredProps {
  children: (string | JSX.Element)[] | string | JSX.Element
}

interface IModalOptionalProps {
  containerClass: string
  backgroundClass: string
  modalClass: string
  modalAnimationInClass: string
}

interface IModalProps
  extends IModalRequiredProps,
    IModalOptionalProps {}


const defaultProps: IModalOptionalProps = {
  containerClass: '',
  backgroundClass: '',
  modalClass: '',
  modalAnimationInClass: ''
}

const Modal = (props: IModalProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const [backgroundAnimationIn, setBackgroundAnimationIn] = useState<string>('modality__background__animation-in')
  const [backgroundAnimationOut, setBackgroundAnimationOut] = useState<string>('modality__background__animation-out')

  const [modalAnimationIn, setModalAnimationIn] = useState<string>('modality__modal__animation-in')
  const [modalAnimationOut, setModalAnimationOut] = useState<string>('modality__modal__animation-out')

  return (
    <>
      <div 
        className={
          `modality__background 
          ${props.backgroundClass ? props.backgroundClass : ''}
          ${open ? backgroundAnimationIn : backgroundAnimationOut}`
        }
      />
      <div 
        className={
          `modality__container 
          ${props.containerClass ? props.containerClass : ''}`
        }
      >
        <div 
          className={
            `modality__modal
            ${props.modalClass ? props.modalClass : ''}
            ${open ? modalAnimationIn : modalAnimationOut}`
          }
        >
          {props.children}
        </div>
      </div>
    </>
  )
}

Modal.defaultProps = defaultProps
export default Modal