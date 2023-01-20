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

const Prestation = ({title = "", data = '', ...rest}) => {
    return(<>
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container className="contentSection">
            <Columns className="serviceSection">
                {data && data.map((service, i) => (
                    <Columns.Column key={i}>
                        {i === 1 &&
                            <span className="icon">
                                <FontAwesomeIcon icon="tshirt" size="xs" />
                            </span>
                        }
                        {i === 0 &&
                            <span className="icon">
                                <FontAwesomeIcon icon="pencil-alt" size="xs" />
                            </span>
                        }
                        <Heading className="titleServices" size={4}>
                            {service.name}
                        </Heading>
                        <Content className="contentServices">
                            {service.content}
                        </Content>
                    </Columns.Column>
                ))}
                <Columns.Column className="flexEndContent">
                <Container className="containLink">
                    <Link href="/About">
                        <a className="linkSee getWhite">En Savoir plus <span className="icoRight" width={26}></span></a>
                    </Link>
                </Container>
                </Columns.Column>
            </Columns>
        </Container>
    </Section>
    </>)
}

export default Prestation;