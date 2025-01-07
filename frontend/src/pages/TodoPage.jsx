import { useState, useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import styled from 'styled-components'
import useLocalStorage from '../hooks/localStorage'
import TodoList from '../components/ListTodo'
import AddBox from '../components/AddBox'
import { TagSearch, TagBox } from '../components/TagBox'
import SearchBox from '../components/SearchBox'
import { ListTodo, ListTag } from '../../wailsjs/go/main/App'
import FooterBox from '../components/FooterBox'
import TodoMenu from '../components/TodoMenu'

const MainDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding-bottom: 50px;
  background-color: ${(props) => props.theme.bg};
`

const LeftDiv = styled.div``

const RightDiv = styled.div`
  width: 100%;
`

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState({})
  const [searchTagIds, setSearchTagIds] = useState({})
  // const [activeMenu, setActiveMenu] = useState('ALL')
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'ALL')
  const [keyword, setKeyword] = useState('')

  const [modalShow, setModalShow] = useState(false)

  const menus = {
    ALL: {
      id: 1,
      name: 'ALL',
    },
    TODO: {
      id: 2,
      name: 'TODO',
    },
    DONE: {
      id: 3,
      name: 'DONE',
    },
  }

  const menusArr = Object.keys(menus)

  const refresh = async () => {
    const page = { kw: keyword, size: 10, current: 1 }
    // 过滤选中的tag
    const filteredIds = []
    Object.keys(searchTagIds).map((id) => {
      if (searchTagIds[id]) {
        filteredIds.push(id)
      }
    })
    page.tagIds = filteredIds
    console.log(page.tagIds)

    ListTodo(JSON.stringify(page, null, 2)).then((res) => {
      console.log(res)
      let response
      if (res !== '') {
        response = JSON.parse(res)
      }
      if (response && response.code === 200) {
        let newTodos = response.data
        setTodos(newTodos)
      }
    })
  }

  const refreshTag = () => {
    ListTag().then((res) => {
      let response
      if (res !== '') {
        response = JSON.parse(res)
      }
      if (response && response.code === 200) {
        let newTags = response.data
        setTags(newTags)
      }
    })
  }
  useEffect(() => {
    refresh()
  }, [activeTab, keyword, searchTagIds])

  useEffect(() => {
    refreshTag()
  }, [])

  return (
    <>
      <MainDiv>
        <LeftDiv>
          <SearchBox setKeyword={setKeyword}></SearchBox>
          <TodoMenu
            menus={menus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TagSearch
            tags={tags}
            searchTagIds={searchTagIds}
            setSearchTagIds={setSearchTagIds}
          ></TagSearch>
        </LeftDiv>
        <RightDiv>
          <AddBox
            refresh={refresh}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
          />
          <TagBox
            tags={tags}
            refreshTag={refreshTag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          ></TagBox>
          <TodoList
            todos={todos}
            menusArr={menusArr}
            activeTab={activeTab}
            refresh={refresh}
          />
        </RightDiv>
      </MainDiv>
      <FooterBox></FooterBox>
    </>
  )
}
