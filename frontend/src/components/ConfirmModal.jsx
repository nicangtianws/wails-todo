import { useState } from 'react'
import styled from 'styled-components'

const OverlayDiv = styled.div`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  > div {
    position: relative;
    width: 300px;
    max-width: 80%;
    background: white;
    border-radius: 8px;
    padding: 1em 2em;
  }
`

export default function ComfirmModal({
  title,
  content,
  submitCallback,
  cancelCallback,
  modalShow,
  setModalShow
}) {
  return (
    <OverlayDiv $show={modalShow}>
      <div>
        <h3>{title}</h3>
        <div>{content}</div>
        <div>
          <button
            onClick={() => {
              setModalShow(false)
              submitCallback()
            }}
          >
            确认
          </button>
          <button
            onClick={() => {
              setModalShow(false)
              cancelCallback()
            }}
          >
            取消
          </button>
        </div>
      </div>
    </OverlayDiv>
  )
}
