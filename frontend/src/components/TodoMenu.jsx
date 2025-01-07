import styled from 'styled-components'

const MenuUl = styled.ul`
  list-style: none;
  min-width: 100px;
  min-height: 50px;
  padding: 0;
`

const MenuLi = styled.li`
  background-color: ${(props) =>
    props.$active ? props.theme.activeBg : props.theme.bg1};
  color: ${(props) => (props.$active ? props.theme.activeFg : props.theme.fg)};
  margin: 5px;
  padding: 10px;
  border-radius: 50px;
  &:hover {
    background-color: ${(props) => props.theme.hover};
  }
`

export default function TodoMenu({ menus, activeTab, setActiveTab }) {
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