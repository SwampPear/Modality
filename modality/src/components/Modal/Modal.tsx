import React from 'react'
import './Modal.css'


interface IModalRequiredProps {
  children: (string | JSX.Element)[] | string | JSX.Element
}

interface IModalOptionalProps {
  containerClass: string
  backgroundClass: string
  modalClass: string
}

interface IModalProps
  extends IModalRequiredProps,
    IModalOptionalProps {}


const defaultProps: IModalOptionalProps = {
  containerClass: '',
  backgroundClass: '',
  modalClass: ''
}

const Modal = (props: IModalProps) => {
  return (
    <>
      <div 
        className={
          `modality__background 
          ${props.backgroundClass ? props.backgroundClass : ''}`
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
            ${props.modalClass ? props.modalClass : ''}`
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