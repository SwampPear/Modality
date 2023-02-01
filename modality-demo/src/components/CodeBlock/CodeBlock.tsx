import React, { useState } from 'react'
import styles from './CodeBlock.module.css'

import FileName from '../FileName/FileName'
import Parser, {jsParseCFG, ICFGConfig} from '../Parser/Parser'


/**
 * Interface that defines the required props for the CodeBlock component.
 */
interface ICodeBlockRequiredProps {
  content: string;
}


/**
 * Interface that defines the optional props for the CodeBlock component.
 */
interface ICodeBlockOptionalProps {
  containerClass: string;
  fileNameClass: string;
  contentClass: string,
  fileName: string;
  CFGConfig: ICFGConfig
}


/**
 * Interface that defines the required and optional props for the CodeBlock component.
 */
interface ICodeBlockProps
  extends ICodeBlockRequiredProps,
    ICodeBlockOptionalProps {}


// default props for the CodeBlock component.
const defaultProps: ICodeBlockOptionalProps = {
  containerClass: '',
  fileNameClass: '',
  contentClass: '',
  fileName: '',
  CFGConfig: jsParseCFG
}


/**
 * Renders a CodeBlock component.
 * @param props props for component
 * @returns the CodeBlock component
 */
const CodeBlock = (props: ICodeBlockProps) => {
  const [copyButtonClicked, setCopyButtonClicked] = useState(false)

  let parser: Parser = new Parser({text: props.content, CFGConfig: props.CFGConfig})

  /**
   * Manages clipboard and animation functionality of copy button.
   */
  const copyButtonOnClick = () => {
    navigator.clipboard.writeText(props.content)

    // toggle copy button
    if (!copyButtonClicked) {
      setCopyButtonClicked(true)
      setTimeout(() => {
        setCopyButtonClicked(false)
      }, 1500)
    }
  }

  return (
    <div 
      className={`${styles.stumpContainerClass} ${props.containerClass}`}
    >
      <FileName
        fileName={props.fileName}
        className={`${styles.stumpFileNameClass} ${props.fileNameClass}`}
      />
      <div className={styles.stumpContentWrapperClass}>
        <div className={`${styles.stumpContentClass} ${props.contentClass}`}>
          {parser.render()}
        </div>
        <div className={styles.stumpCopyContainerClass}>
          <svg 
            onClick={copyButtonOnClick} 
            className={`${styles.stumpCopyButton} ${copyButtonClicked ? styles.stumpCopyButtonAnimationSVG : ''}`} 
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
          >
            <path className={`${styles.stumpCopyButtonPath1} ${copyButtonClicked ? styles.stumpCopyButtonAnimation1 : ''}`}/>
            <path className={`${styles.stumpCopyButtonPath2} ${copyButtonClicked ? styles.stumpCopyButtonAnimation2 : ''}`}/>
          </svg>
        </div>
      </div>
    </div>
  )
}

CodeBlock.defaultProps = defaultProps
export default CodeBlock