import React, { useState } from 'react';
import { isPropertySignature } from 'typescript';
import styles from './FileName.module.css';


/**
 * Interface that defines the props for the FileName component.
 */
interface IFileName {
  fileName: string,
  className: string
}


/**
 * Conditionally renders a FileName component.
 * @param props props for component
 * @returns the FileName component
 */
const FileName = (props: IFileName) => {
  if (props.fileName) {
    return (
      <div className={props.className}>
        {props.fileName}
      </div>
    )
  } else {
    return <></>
  }
}

export default FileName