import { Link } from 'react-router'
import styled from 'styled-components'

const FooterDiv = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.bg1};
  display: flex;
`

function FooterBox({}) {
  return (
    <>
      <FooterDiv>
        <div className="left">
          <Link to={'/trash'}>
            <i className="bi-trash"></i>
          </Link>
        </div>
        <div className="right">
          <Link to={'/setting'}>
            <i className="bi-gear"></i>
          </Link>
        </div>
      </FooterDiv>
    </>
  )
}

export default FooterBox
