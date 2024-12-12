import { useRef } from "react"
import { AddTodo } from '/wailsjs/go/main/App'
import styled from "styled-components"

const AddBoxDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  input {
    min-width: calc(100% - 64px);
    font-size: 16px;
    border: 1px solid ${(props) => (props.theme.bg1)};
    border-radius: 50px;
    padding: 5px;
    &:focus {
      border-color: ${(props) => (props.theme.activeBg)};
      outline: none;
    }
  }
  button {
    width: 64px;
    background-color: ${(props) => (props.theme.bg1)};
    color: ${(props) => (props.theme.fg)};
    border: none;
    border-radius: 50px;
    margin-left: 10px;
    &:hover {
      color: ${(props) => (props.theme.activeFg)};
      background-color: ${(props) => (props.theme.activeBg)};
    }
  }
`

function AddBox({ refresh, setSelectedTags, selectedTags }) {
  const addRef = useRef(null)
  const inputRef = useRef(null)
  return (
    <AddBoxDiv>
      <input id={'todoInput'} ref={inputRef} />
      <button
        ref={addRef}
        onClick={async (e) => {
          const todoValue = inputRef.current.value
          if (!todoValue && todoValue === '') {
            return
          }

          // 过滤选中的tag
          const filteredIds = []
          Object.keys(selectedTags).map((id) => {
            if (selectedTags[id]) {
              filteredIds.push(id)
            }
          })

          const todo = {
            title: todoValue,
            tags: filteredIds,
          }

          AddTodo(JSON.stringify(todo, null, 2)).then((res) => {
            if (res !== 'success') {
              message(res, '错误')
              return
            }
            refresh()
            setSelectedTags({})
            inputRef.current.value = ''
          })
        }}
      >
        <i className={'bi bi-arrow-right-circle'}></i>
      </button>
    </AddBoxDiv>
  )
}

export default AddBox