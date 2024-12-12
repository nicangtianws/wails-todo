import { useState, useRef, useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './App.css'
import styled from 'styled-components'
import useLocalStorage from './hooks/localStorage'
import TodoList from './components/ListTodo'
import AddBox from './components/AddBox'
import { TagSearch, TagBox } from './components/TagBox'
import SearchBox from './components/SearchBox'
import { ListTodo, ListTag } from '../wailsjs/go/main/App'

const MainDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding-bottom: 50px;
  background-color: ${(props) => (props.theme.bg)};
`

const LeftDiv = styled.div``

const MenuUl = styled.ul`
  list-style: none;
  min-width: 100px;
  min-height: 50px;
  padding: 0;
`

const MenuLi = styled.li`
  background-color: ${(props) => (props.$active ? props.theme.activeBg : props.theme.bg1)};
  color: ${(props) => (props.$active ? props.theme.activeFg : props.theme.fg)};
  margin: 5px;
  padding: 10px;
  border-radius: 50px;
  &:hover {
    background-color:  ${(props) => (props.theme.hover)};
  }
`

const RightDiv = styled.div`
  width: 100%;
`

const FooterDiv = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: ${(props) => (props.theme.bg1)};
`

function MenuList({ menus, activeTab, setActiveTab }) {
  let menuItemArr = []

  Object.keys(menus).forEach((key, index) => {
    const menu = menus[key]
    menuItemArr.push(
      <MenuLi
        id={'menu-id-' + menu.id}
        $active={activeTab === key}
        onClick={() => {
          setActiveTab(key)
        }}
        key={'menu-key-' + index}
      >
        {menu.name}
      </MenuLi>
    )
  })

  return <MenuUl>{menuItemArr}</MenuUl>
}

export default function App() {
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
          <MenuList
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
      <FooterDiv></FooterDiv>
    </>
  )
}
