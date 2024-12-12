import { useRef, useState } from 'react'
import styled from 'styled-components'
import { UpdateTag, DelTag, AddTag } from '../../wailsjs/go/main/App'

const TagBoxDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  align-items: center;
  margin: 10px;
  span {
    margin-left: 5px;
  }
`

const TagSpan = styled.span`
  border: 1px solid ${(props) => (props.theme.bg1)};
  border-radius: 15px;
  padding: 5px;
  background-color: ${(props) => (props.$selected ? props.theme.activeBg : props.theme.bg1)};
  color: ${(props) => (props.$selected ? props.theme.activeFg : props.theme.fg)};
  input {
    outline: none;
    border: none;
    width: 64px;
    border-radius: 15px;
  }
  &:hover {
    color: ${(props) => (props.theme.activeFg)};
    background-color: ${(props) => (props.theme.activeBg)};
  }
  i {
    margin-left: 5px;
    &:hover {
      color: ${(props) => (props.theme.specAccent)};
    }
  }
`

const TagAddSpan = styled.span`
  :hover {
    color: ${(props) => (props.theme.specAccent)};
  }
`

function Tag({ id, name, selected, refreshTag, handleSelectTag }) {
  const [editMode, setEditMode] = useState(false)
  const inputRef = useRef(null)

  if (editMode) {
    return (
      <TagSpan>
        <input type="text" defaultValue={name} ref={inputRef} autoFocus></input>
        <i
          className="bi bi-check"
          onClick={async () => {
            if (id) {
              const tag = {
                id: id,
                name: inputRef.current.value,
              }
              UpdateTag(JSON.stringify(tag, null, 2)).then((res) => {
                if (res === 'success') {
                  setEditMode(false)
                  refreshTag()
                }
              })
            }
          }}
        ></i>
        <i
          className="bi bi-x"
          onClick={async () => {
            setEditMode(false)
            refreshTag()
          }}
        ></i>
      </TagSpan>
    )
  } else {
    return (
      <TagSpan
        id={'id-tag-' + id}
        $selected={selected}
        onClick={() => {
          handleSelectTag(id)
        }}
        onDoubleClick={() => {
          setEditMode(true)
        }}
      >
        <span>{name}</span>
        <i
          className="bi bi-x"
          onClick={async () => {
            if (!(await confirm('是否确认删除？', '警告'))) {
              return
            }
            const tag = { id: id }
            DelTag(JSON.stringify(tag, null, 2)).then((res) => {
              if (res === 'success') {
                setEditMode(false)
                refreshTag()
              }
            })
          }}
        ></i>
      </TagSpan>
    )
  }
}

function TagAdd({ refreshTag }) {
  const inputRef = useRef(null)
  const [editMode, setEditMode] = useState(false)
  if (editMode) {
    return (
      <TagSpan>
        <input type="text" ref={inputRef} autoFocus></input>
        <i
          className="bi bi-check"
          onClick={async () => {
            if (
              !inputRef.current.value ||
              inputRef.current.value.trim() === ''
            ) {
              setEditMode(false)
              return
            }
            const tag = {
              name: inputRef.current.value.trim(),
            }

            AddTag(JSON.stringify(tag, null, 2)).then((res) => {
              if (res === 'success') {
                setEditMode(false)
                refreshTag()
              }
            })
          }}
        ></i>
        <i
          className="bi bi-x"
          onClick={async () => {
            setEditMode(false)
            refreshTag()
          }}
        ></i>
      </TagSpan>
    )
  } else {
    return (
      <TagAddSpan>
        <i
          onClick={() => {
            setEditMode(true)
          }}
          className="bi bi-plus-circle"
        ></i>
      </TagAddSpan>
    )
  }
}

export function TagBox({ tags, refreshTag, selectedTags, setSelectedTags }) {
  const handleSelectTag = (id) => {
    const newSelectedTags = {
      ...selectedTags,
    }
    newSelectedTags[id] = !selectedTags[id]
    setSelectedTags(newSelectedTags)
  }

  const tagArr = []
  tags.map((tag) => {
    if (tag.del === 0) {
      tagArr.push(
        <Tag
          key={'key-tag-' + tag.id}
          id={tag.id}
          name={tag.name}
          selected={selectedTags[tag.id]}
          refreshTag={refreshTag}
          handleSelectTag={handleSelectTag}
        ></Tag>
      )
    }
  })

  return (
    <TagBoxDiv>
      <span>标签:</span>
      {tagArr}
      <TagAdd refreshTag={refreshTag}></TagAdd>
    </TagBoxDiv>
  )
}

const TagSearchBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  align-items: center;
  margin: 5px;
  span {
    margin-right: 5px;
  }
`

export function TagSearch({ tags, searchTagIds, setSearchTagIds }) {
  const handleSelectTag = (id) => {
    const newSearchTagIds = {
      ...searchTagIds,
    }
    newSearchTagIds[id] = !searchTagIds[id]
    setSearchTagIds(newSearchTagIds)
  }

  let tagArr = []

  tags.map((tag) => {
    if (tag.del === 0) {
      let selected = searchTagIds[tag.id] ? true : false
      tagArr.push(
        <TagSpan
          key={'key-tag-' + tag.id}
          id={'id-tag-' + tag.id}
          $selected={selected}
          onClick={() => {
            handleSelectTag(tag.id)
          }}
        >
          {tag.name}
        </TagSpan>
      )
    }
  })

  return <TagSearchBox>{tagArr}</TagSearchBox>
}

export default TagBox
