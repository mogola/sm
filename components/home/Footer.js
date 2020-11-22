import Link from 'next/link'
import {
    Container,
    Columns,
    Section,
    Heading,
    Image,
    Box,
    Loader,
    Tag,
    Content,
    Icon
} from 'react-bulma-components';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faTshirt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faCheckSquare, faTshirt, faPencilAlt)

const Footer = ({title = "", menu='', data = '', ...rest}) => {
    return(<>
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container className="contentSection">
            <Columns className="footerSection">
                <ul className="listMenuFooter">
                    {menu.map((item, i) => (
                        <li key={i}>
                            <Link href={item.url}>
                                <a>{item.name}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Columns>
        </Container>
        <Container className="contentSection">
            <Columns className="footerSection">
                <Columns.Column className="partFooter">
                    <Heading className="titleSubFooter" size={4}>{data.textCategoryServices}</Heading>
                    {data.textContentServices.map((item, i) =>(
                        <li key={i}>
                        <Link href={item.name}>
                            <a>{item.name}</a>
                        </Link>
                    </li>
                    ))}
                </Columns.Column>
                <Columns.Column className="partFooter">
                    <Heading className="titleSubFooter" size={4}>{data.textFollowMe}</Heading>
                    {data.socialLink.map((item, i) =>(
                        <li key={i}>
                        <Link href={item.url}>
                            <a>{item.name}</a>
                        </Link>
                    </li>
                    ))}
                </Columns.Column>
                <Columns.Column className="partFooter">
                    <Heading className="titleSubFooter" size={4}>{data.textContactMe}</Heading>
                    <ul>
                        <li className="emailContact">
                            <Link href="">
                                <a mailto={data.email}>{data.email}</a>
                            </Link>
                        </li>
                        <li className="phoneContact">
                            <Link href="">
                                <a>{data.phone}</a>
                            </Link>
                        </li>
                    </ul>
                </Columns.Column>
            </Columns>
        </Container>
        <Container className="txtLegale">
            <Content dangerouslySetInnerHTML={{__html:data.textMentionLegale}}>
            </Content>
        </Container>
    </Section>
    </>)
}

export default Footer;