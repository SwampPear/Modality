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
  const [opened, setOpened] = useState<boolean>(false)

  const [backgroundAnimation, setBackgroundAnimation] = useState<string>('')
  const [backgroundAnimationIn, setBackgroundAnimationIn] = useState<string>('modality__background__animation-in')
  const [backgroundAnimationOut, setBackgroundAnimationOut] = useState<string>('modality__background__animation-out')

  const [modalAnimation, setModalAnimation] = useState<string>('')
  const [modalAnimationIn, setModalAnimationIn] = useState<string>('modality__modal__animation-in')
  const [modalAnimationOut, setModalAnimationOut] = useState<string>('modality__modal__animation-out')

  const open = () => {
    if (!opened) {
      setOpened(true)

      setBackgroundAnimation(backgroundAnimationIn)

      setTimeout(() => {
        setModalAnimation(modalAnimationIn)
      }, 500)
    }
  }

  return (
    <>
      {open()}
      <div 
        className={
          `modality__background ${props.backgroundClass ? props.backgroundClass : ''} ${backgroundAnimation}`
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
            `modality__modal ${props.modalClass ? props.modalClass : ''} ${modalAnimation}`
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