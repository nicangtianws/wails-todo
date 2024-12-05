import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { MarkTodo, UpdateTodo, RemoveTodo } from '../../wailsjs/go/main/App'

const TodoUl = styled.div``

const ItemLi = styled.li`
  list-style: none;
  min-width: 164px;
  min-height: 30px;
  margin: 10px;
  background-color: aliceblue;
  border-radius: 50px;
`

const TodoItemDiv = styled.div`
  display: grid;
  grid-template-columns: calc(100% - 112px) 48px 32px 32px;
  align-items: center;
  .btn-edit {
    border: none;
    /* background-color: #e6a1c1; */
    border-radius: 50px;
    &:hover {
      background-color: #e6a1c1;
      color: aliceblue;
    }
  }
  .btn-del {
    border: none;
    border-radius: 50px;
    &:hover {
      background-color: red;
      color: aliceblue;
    }
  }
  input {
    min-width: calc(100% - 64px);
    font-size: 16px;
    border: 1px solid #aed5f7;
    border-radius: 50px;
    padding: 10px;
    &:focus {
      border-color: #e65e9e;
      outline: none;
    }
  }
`
const TodoContentSpan = styled.span`
  background-color: ${(props) => (props.$done ? '#dddddd' : '#c9e2f8')};
  padding: 10px;
  border-radius: 50px;
  text-decoration: ${(props) => (props.$done ? 'line-through' : 'none')};
`

const DelMarkBtn = styled.button`
  text-align: center;
  align-content: center;
  background-color: transparent;
  border: none;
  color: red;
  &:hover {
    background-color: red;
    color: aliceblue;
    border-radius: 50px;
  }
`

function TodoList({ todos, activeTab, menusArr, refresh }) {
  let todoItemArr = []
  todos.forEach((todo, index) => {
    if (activeTab !== menusArr[0] && todo.status !== activeTab) {
      return
    }

    // if (Object.keys(searchTagIds).length > 0) {
    //   let filteredTagId = todo.tags.split(',').filter((t) => {
    //     return searchTagIds[t]
    //   })

    //   if (filteredTagId.length === 0) {
    //     return
    //   }
    // }

    todoItemArr.push(
      <TodoItem
        id={todo.id}
        title={todo.title}
        status={todo.status}
        refresh={refresh}
        key={'key-todo-' + index}
      />
    )
  })
  return <TodoUl>{todoItemArr}</TodoUl>
}

function TodoContent({ id, title, editMode, status, inputRef }) {
  if (editMode) {
    return (
      <input
        id={'id-todo-content-' + id}
        defaultValue={title}
        ref={inputRef}
        autoFocus
      ></input>
    )
  } else {
    return <TodoContentSpan $done={status === 'DONE'}>{title}</TodoContentSpan>
  }
}

function TodoItem({ id, title, tag, status, refresh }) {
  const [editMode, setEditMode] = useState(false)
  const inputRef = useRef(null)

  const changeEditMode = async () => {
    if (editMode) {
      if (inputRef.current.value === '') {
        await message('内容不能为空', '提示')
        return
      }
      const todo = { id: id, title: inputRef.current.value }
      await UpdateTodo(JSON.stringify(todo, null, 2)).then((res) => {
        if (res !== 'success') {
          message(res, '错误')
          return
        }
        refresh()
      })
    }

    setEditMode(!editMode)
  }

  useEffect(() => {
    if (editMode) {
      inputRef.current.focus()
    }
  }, [editMode])

  return (
    <ItemLi id={'id-todo-' + id}>
      <TodoItemDiv>
        <TodoContent
          title={title}
          id={id}
          editMode={editMode}
          status={status}
          inputRef={inputRef}
        ></TodoContent>
        <button className="btn-edit" onClick={changeEditMode}>
          {editMode ? '完成' : '编辑'}
        </button>
        <input
          type="checkbox"
          checked={status === 'DONE'}
          onChange={(e) => {
            const status = e.target.checked ? 'DONE' : 'TODO'
            const todo = { id: id, status: status }
            MarkTodo(JSON.stringify(todo, null, 2)).then((res) => {
              if (res !== 'success') {
                message(res, '错误')
                return
              }
              refresh()
            })
          }}
        />
        <DelMarkBtn
          onClick={async (e) => {
            if (!(await confirm('是否确认删除？', '警告'))) {
              return
            }
            const todo = { id: id }
            RemoveTodo(JSON.stringify(todo, null, 2)).then((res) => {
              if (res !== 'success') {
                message(res, '错误')
                return
              }
              refresh()
            })
          }}
        >
          X
        </DelMarkBtn>
      </TodoItemDiv>
    </ItemLi>
  )
}

export default TodoList
