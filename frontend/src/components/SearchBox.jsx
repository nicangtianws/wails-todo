import { useRef } from 'react'
import styled from 'styled-components'

const SearchDiv = styled.div`
  margin: 10px;
  display: flex;
  flex-grow: 1;
  min-width: calc(100% - 64px);
  font-size: 16px;
  border: 1px solid ${(props) => (props.theme.bg1)};
  border-radius: 50px;
  &:focus-within {
    border-color: ${(props) => (props.theme.activeBg)};
  }
  input {
    font-size: 16px;
    padding: 3px;
    border: none;
    outline: none;
    border-radius: 50px;
    &:focus {
      border: none;
      outline: none;
    }
  }
  button {
    background-color: ${(props) => (props.theme.bg1)};
    color: ${(props) => (props.theme.fg)};
    text-decoration: none;
    border: none;
    border-radius: 50px;
    padding: 5px;
    width: 32px;
    height: 32px;
    &:hover {
      color: ${(props) => (props.theme.activeFg)};
      background-color: ${(props) => (props.theme.activeBg)};
    }
  }
`

const SearchBox = ({ setKeyword }) => {
  const kwRef = useRef(null)

  const search = () => {
    let kw = kwRef.current.value
    setKeyword(kw)
  }

  return (
    <SearchDiv id={'search-box'}>
      <input type={'text'} ref={kwRef}></input>
      <button onClick={search}>
        <i className={'bi-search'}></i>
      </button>
    </SearchDiv>
  )
}

export default SearchBox
